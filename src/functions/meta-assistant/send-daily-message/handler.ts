import { type ValidatedAPIGatewayProxyEvent, type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, type DailyHandlerResponse } from "src/libs/api-gateway";
import type { DailyCombinedData } from "src/types/meta-assistant/index";
import type schema from "src/types/meta-assistant/index";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";

/**
 * AWS-less handler for sendDailyMessage
 *
 * @returns Promise of DailyHandlerResponse
 */
export const sendDailyMessageHandler = async (): Promise<DailyHandlerResponse> => {
  try {
    const severaApi = CreateSeveraApiService();
    const severaUsers = await severaApi.getOptInUsers();
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const workHours = await severaApi.getPreviousWorkHours();
    const slackUsers = await SlackUtilities.getSlackUsers();
    if (!severaUsers) {
      throw new Error("No persons retrieved from Severa");
    }

    // Get the user's guid from workHours
    const workHoursUserGuids = Array.isArray(workHours) ? workHours.map(hour => hour.user.guid) : [];

    // Filter severaUsers to include only those found in WorkHours
    const filteredSeveraUsers = Array.isArray(severaUsers) ? severaUsers.filter(user => workHoursUserGuids.includes(user.guid)) : [];

    // Function to find Slack user by firstName and lastName
    const findSlackUser = (firstName: string, lastName: string) => {
      return slackUsers.find(slackUser => slackUser.profile.first_name === firstName && slackUser.profile.last_name === lastName);
    };

    // Combine user data
    const combinedUserData: DailyCombinedData[] = await Promise.all(
      Array.isArray(filteredSeveraUsers) ? filteredSeveraUsers.map(async user => {
        const userWorkHours = Array.isArray(workHours) ? workHours.filter(hour => hour.user.guid === user.guid) : [];
        const workDays = await severaApi.getWorkDays(user.guid);
        const quantity = userWorkHours[0]?.quantity || 0;
        const enteredHours = workDays[0]?.enteredHours || 0;
        const expectedHours = user.workContract.dailyHours || 0;
        const minimumBillableRate = 75;

        let totalBillableTime = 0;

        Array.isArray(workHours) && workHours.forEach(hour => {
          if (hour.isBillable && hour.user.guid === user.guid) {
            totalBillableTime += hour.quantity;
          }
        });

        const nonBillableProject = enteredHours - totalBillableTime;

        // Find the corresponding Slack user
        const slackUser = findSlackUser(user.firstName, user.lastName);

        const result = {
          userId: user.guid,
          firstName: user.firstName,
          lastName: user.lastName,
          enteredHours: enteredHours,
          expectedHours: expectedHours,
          quantity: quantity,
          minimumBillableRate: minimumBillableRate,
          totalBillableTime: totalBillableTime,
          nonBillableProject: nonBillableProject,
          date: previousWorkDays.yesterday.toISO(),
          slackId: slackUser ? slackUser.id : null
        };

        return result;
      }) : []
    );

    const messageSent = await SlackUtilities.postDailyMessageToUsers(combinedUserData, previousWorkDays);

    return {
      message: "Daily messages constructed successfully",
      data: messageSent
    };
  } catch (error) {
    console.error(error.toString());
    return {
      message: `Error while sending slack message: ${error}`
    };
  }
};
/**
 * Lambda function for sending slack message
 *
 * @param event API Gateway proxy event
 * @returns JSON response
 */
const sendDailyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => (
  formatJSONResponse({
    ...await sendDailyMessageHandler(),
    event: event
  })
);

export const main = sendDailyMessage;