import { type ValidatedAPIGatewayProxyEvent, type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, type WeeklyHandlerResponse } from "src/libs/api-gateway";
import ForecastApiUtilities from "src/meta-assistant/forecastapi/forecast-api";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import TimeBankApiProvider from "src/meta-assistant/timebank/timebank-api";
import TimebankUtilities from "src/meta-assistant/timebank/timebank-utils";
import { CreateSeveraApiService } from "src/services/severa-api-service";
import type SeveraResponseUser from "src/types/severa/user/severaResponseUser";
import type schema from "src/types/meta-assistant/index";
import type { WeeklyCombinedData } from "src/types/meta-assistant/index";
import { Timespan } from "src/generated/client/api";

/**
 * Handler for sendWeeklyMessage
 *
 * @returns Promise of WeeklyHandlerResponse
 */
export const sendWeeklyMessageHandler = async (): Promise<WeeklyHandlerResponse> => {
  try {
    const severaApi = CreateSeveraApiService();
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const { dayBeforeYesterday } = previousWorkDays;
    const { weekStartDate, weekEndDate } = TimeUtilities.getlastWeeksDates(dayBeforeYesterday);
    const severaUsers = await severaApi.getOptInUsers() as SeveraResponseUser[];
    const slackUsers = await SlackUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(weekStartDate);
    const nonProjectTimes = await ForecastApiUtilities.getNonProjectTime();
    if (!severaUsers) {
      throw new Error("No users retrieved from Severa");
    }

    const personTotalTimes: WeeklyCombinedData[] = [];

    for (const timebankUser of timebankUsers) {
      const personTotalTime = await TimeBankApiProvider.getPersonTotalEntries(
        Timespan.WEEK,
        timebankUser,
        weekStartDate.year,
        weekStartDate.month,
        weekEndDate.weekNumber,
        accessToken
      );
      if (personTotalTime) {
        personTotalTimes.push(personTotalTime);
      }
    }

    const weeklyCombinedData = TimebankUtilities.combineWeeklyData(personTotalTimes, slackUsers);

    const messagesSent = await SlackUtilities.postWeeklyMessageToUsers(weeklyCombinedData, timeRegistrations, previousWorkDays, nonProjectTimes);

    const errors = messagesSent.filter(messageSent => messageSent.response.error);

    if (errors.length) {
      let errorMessage = "Error while posting slack messages, ";

      errors.forEach(error => {
        errorMessage += `${error.response.error}\n`;
      });
      console.error(errorMessage);
    }

    return {
      message: "Everything went well sending the weekly, see data for message breakdown...",
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
   * Lambda for sending weekly messages
   *
   * @param event API Gateway proxy event
   * @returns JSON response
   */
  const sendWeeklyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => (
  formatJSONResponse({
    ...await sendWeeklyMessageHandler(),
    event: event
  })
);

export const main = sendWeeklyMessage;