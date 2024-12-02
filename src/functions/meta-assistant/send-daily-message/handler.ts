import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "src/libs/api-gateway";
import { middyfy } from "src/libs/lambda";
import type { DailyCombinedData } from "src/types/meta-assistant/index";
import schema from "src/types/meta-assistant/index";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import MessageUtilities from "src/meta-assistant/generic/message-utils";
import Auth from "src/meta-assistant/auth/auth-provider";

/**
 * AWS-less handler for sendDailyMessage
 *
 * @returns Promise of DailyHandlerResponse
 */

export const sendDailyMessageHandler = async (): Promise<DailyHandlerResponse> => {
  try {
    const severaApi = CreateSeveraApiService();
    const severaUsers = await severaApi.getUsers();
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const workHours = await severaApi.getWorkhours();
    if (!severaUsers) {
      throw new Error("No persons retrieved from Severa");
    }

    // Extract user GUIDs from projectHours
    const workHoursUserGuids = Array.isArray(workHours) ? workHours.map(hour => hour.user.guid) : [];

    // Filter severaUsers to include only those found in WorkHours
    const filteredSeveraUsers = Array.isArray(severaUsers) ? severaUsers.filter(user => workHoursUserGuids.includes(user.guid)) : [];

    // Combine user data
    const combinedUserData: DailyCombinedData[] = await Promise.all(
      Array.isArray(filteredSeveraUsers) ? filteredSeveraUsers.map(async user => {
        const userWorkHours = Array.isArray(workHours) ? workHours.filter(hour => hour.user.guid === user.guid) : [];
        const workDays = await severaApi.getWorkDays(user.guid);
        const quantity = userWorkHours[0]?.quantity || 0;
        const enteredHours = workDays[0]?.enteredHours || 0;
        const expectedHours = user.workContract.dailyHours || 0;
        const minimumBillableRate = 0;

        let totalBillableTime = 0;

        Array.isArray(workHours) && workHours.forEach(hour => {
          if (hour.isBillable && hour.user.guid === user.guid) {
            totalBillableTime += hour.quantity;
          }
        });

        const nonBillableProject = enteredHours - totalBillableTime;

        const result = {
          userGuid: user.guid,
          firstName: user.firstName,
          enteredHours: enteredHours,
          expectedHours: expectedHours,
          quantity: quantity,
          minimumBillableRate: minimumBillableRate,
          totalBillableTime: totalBillableTime,
          nonBillableProject: nonBillableProject,
          date: previousWorkDays.yesterday.toISO()
        };

        totalBillableTime = 0;

        return result;
      }) : []
    );

    console.log("Combined User Data: ", combinedUserData);
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