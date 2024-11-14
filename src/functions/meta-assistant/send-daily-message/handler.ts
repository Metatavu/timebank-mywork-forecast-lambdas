import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "src/libs/api-gateway";
import { middyfy } from "src/libs/lambda";
import schema from "src/types/meta-assistant/index";
import TimeBankApiProvider from "src/meta-assistant/timebank/timebank-api";
import TimebankUtilities from "src/meta-assistant/timebank/timebank-utils";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import { DailyEntriesApi, DailyEntry } from "src/generated/client/api";
import ForecastApiUtilities from "src/meta-assistant/forecastapi/forecast-api";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import { CreateKeycloakApiService } from "src/database/services/keycloak-api-service";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
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
    const severaUsersList = CreateSeveraApiService();
    const severaUsers = await severaUsersList.getUsers();
    const slackUsers = await SlackUtilities.getSlackUsers();
    // const timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
    // const nonProjectTimes = await ForecastApiUtilities.getNonProjectTime();

    if (!severaUsers) {
      throw new Error("No users retrieved from Severa");
    }

    const dailyEntries: DailyEntry[] = [];

    for (const severaUser of severaUsers) {
      const dailyEntry = await TimeBankApiProvider.getDailyEntries(severaUser.id, yesterday, yesterday, accessToken);
      if (dailyEntry && !dailyEntry.isVacation) {
        dailyEntries.push(dailyEntry);
      }
    }


    // const filteredTimebankUsers = timebankUsers.filter(person => dailyEntries.find(dailyEntry => dailyEntry.person === person.id));

    const dailyCombinedData = TimebankUtilities.combineDailyData(severaUsers, dailyEntries, slackUsers);
    // const messagesSent = await SlackUtilities.postDailyMessageToUsers(dailyCombinedData, timeRegistrations, previousWorkDays, nonProjectTimes);
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
}

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