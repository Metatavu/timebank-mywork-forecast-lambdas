import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, WeeklyHandlerResponse } from "src/libs/api-gateway";
import { middyfy } from "src/libs/lambda";
import ForecastApiUtilities from "src/meta-assistant/forecastapi/forecast-api";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import SlackApiUtilities from "src/meta-assistant/slackapi/slackapi-utils";
import TimeBankApiProvider from "src/meta-assistant/timebank/timebank-api";
import TimebankUtilities from "src/meta-assistant/timebank/timebank-utils";
import schema, { WeeklyCombinedData } from "src/types/meta-assistant/index";
import { Timespan } from "src/generated/client/api";
import Auth from "src/meta-assistant/auth/auth-provider";

/**
 * AWS-less handler for sendWeeklyMessage
 *
 * @returns Promise of WeeklyHandlerResponse
 */
export const sendWeeklyMessageHandler = async (): Promise<WeeklyHandlerResponse> => {
  try {
    const { accessToken } = await Auth.getAccessToken();
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const { dayBeforeYesterday } = previousWorkDays;

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);
    const slackUsers = await SlackApiUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
    const NonProjectTimes = await ForecastApiUtilities.getNonProjectTime();

    if (!timebankUsers) {
      throw new Error("No persons retrieved from Timebank");
    }

    const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();
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

    const messagesSent = await SlackApiUtilities.postWeeklyMessageToUsers(weeklyCombinedData, timeRegistrations, previousWorkDays, NonProjectTimes);

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
export const sendWeeklyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => (
  formatJSONResponse({
    ...await sendWeeklyMessageHandler(),
    event: event
  })
);

export const main = middyfy(sendWeeklyMessage);