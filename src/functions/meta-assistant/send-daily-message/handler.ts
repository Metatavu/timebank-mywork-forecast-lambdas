import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "src/libs/api-gateway";
import { middyfy } from "src/libs/lambda";
import schema from "src/types/meta-assistant/index";
import TimeBankApiProvider from "src/meta-assistant/timebank/timebank-api";
import TimebankUtilities from "src/meta-assistant/timebank/timebank-utils";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import { DailyEntry } from "src/generated/client/api";
import ForecastApiUtilities from "src/meta-assistant/forecastapi/forecast-api";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import Auth from "src/meta-assistant/auth/auth-provider";

/**
 * AWS-less handler for sendDailyMessage
 *
 * @returns Promise of DailyHandlerResponse
 */
export const sendDailyMessageHandler = async (): Promise<DailyHandlerResponse> => {
  try {
    const { accessToken } = await Auth.getAccessToken();
    if (!accessToken) {
      throw new Error("Timebank authentication failed");
    }

    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const { yesterday, dayBeforeYesterday } = previousWorkDays;

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);
    const slackUsers = await SlackUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);

    const nonProjectTimes = await ForecastApiUtilities.getNonProjectTime();

    if (!timebankUsers) {
      throw new Error("No persons retrieved from Timebank");
    }

    const dailyEntries: DailyEntry[] = [];

    for (const timebankUser of timebankUsers) {
      const dailyEntry = await TimeBankApiProvider.getDailyEntries(timebankUser.id, yesterday, yesterday, accessToken);
      if (dailyEntry && !dailyEntry.isVacation) {
        dailyEntries.push(dailyEntry);
      }
    }

    const filteredTimebankUsers = timebankUsers.filter(person => dailyEntries.find(dailyEntry => dailyEntry.person === person.id));

    const dailyCombinedData = TimebankUtilities.combineDailyData(filteredTimebankUsers, dailyEntries, slackUsers);
    const messagesSent = await SlackUtilities.postDailyMessageToUsers(dailyCombinedData, timeRegistrations, previousWorkDays, nonProjectTimes);

    const errors = messagesSent.filter(messageSent => messageSent.response.error);

    if (errors.length) {
      let errorMessage = "Error while posting slack messages, ";

      errors.forEach(error => {
        errorMessage += `${error.response.error}\n`;
      });
      console.error(errorMessage);
    }

    return {
      message: "Everything went well sending the daily, see data for message breakdown...",
      data: messagesSent
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

export const main = middyfy(sendDailyMessage);