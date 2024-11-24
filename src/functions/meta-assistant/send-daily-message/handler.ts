import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "src/libs/api-gateway";
import { middyfy } from "src/libs/lambda";
import type { DailyCombinedData, WeeklyCombinedData, TimeRegistrations, PreviousWorkdayDates, NonProjectTime, DailyMessageData, DailyMessageResult, WeeklyMessageData, WeeklyMessageResult } from "src/types/meta-assistant/index";
import schema from "src/types/meta-assistant/index";
import TimeBankApiProvider from "src/meta-assistant/timebank/timebank-api";
import TimebankUtilities from "src/meta-assistant/timebank/timebank-utils";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import { DailyEntry } from "src/generated/client/api";
import ForecastApiUtilities from "src/meta-assistant/forecastapi/forecast-api";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { DateTime } from "luxon";
import MessageUtilities from "src/meta-assistant/generic/message-utils";
import Auth from "src/meta-assistant/auth/auth-provider";

/**
 * AWS-less handler for sendDailyMessage
 *
 * @returns Promise of DailyHandlerResponse
 */
// export const sendDailyMessageHandler = async (): Promise<DailyHandlerResponse> => {
//   try {
//     // const { accessToken } = await Auth.getAccessToken();
//     // if (!accessToken) {
//     //   throw new Error("Timebank authentication failed");
//     // }

//     const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
//     const { yesterday, dayBeforeYesterday } = previousWorkDays;

//     // const timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);
//     const slackUsers = await SlackUtilities.getSlackUsers();
//     const severaApi = CreateSeveraApiService();
//     const severaUsers = await severaApi.getUsers();
//     // const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);

//     // const nonProjectTimes = await ForecastApiUtilities.getNonProjectTime();

//     // if (!timebankUsers) {
//     //   throw new Error("No persons retrieved from Timebank");
//     // }

//     const dailyEntries: DailyEntry[] = [];

//     if (!severaUsers) {
//       throw new Error("No persons retrieved from Severa");
//     }

//     console.log("Severa Users: ", severaUsers);
    
//     const filteredSeveraUsers = Array.isArray(severaUsers) 
//     ? severaUsers.filter(user => user.firstName && user.lastName).map(user => ({
//         id: user.guid,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         monday: user.monday,
//         tuesday: user.tuesday,
//         wednesday: user.wednesday,
//         thursday: user.thursday,
//         friday: user.friday,
//         saturday: user.saturday,
//         sunday: user.sunday,
//         active: user.isActive,
//         unspentVacations: user.unspentVacations,
//         spentVacations: user.spentVacations,
//         minimumBillableRate: user.workContract.hourCost,
//       })) 
//     : [];
//     console.log("Filtered Severa Users: ", filteredSeveraUsers);

//     // for (const timebankUser of timebankUsers) {
//     //   const dailyEntry = await TimeBankApiProvider.getDailyEntries(timebankUser.id, yesterday, yesterday, accessToken);
//     //   if (dailyEntry && !dailyEntry.isVacation) {
//     //     dailyEntries.push(dailyEntry);
//     //   }
//     // }

//     // const filteredTimebankUsers = timebankUsers.filter(person => dailyEntries.find(dailyEntry => dailyEntry.person === person.id));


    // const dailyCombinedData = TimebankUtilities.combineDailyData(filteredSeveraUsers, dailyEntries, slackUsers);
//     console.log("Daily Combined Data: ", dailyCombinedData);
    // const messagesSent = await SlackUtilities.postDailyMessageToUsers(dailyCombinedData, timeRegistrations, previousWorkDays, nonProjectTimes);
//     const errors = messagesSent.filter(messageSent => messageSent.response.error);

//     if (errors.length) {
//       let errorMessage = "Error while posting slack messages, ";

//       errors.forEach(error => {
//         errorMessage += `${error.response.error}\n`;
//       });
//       console.error(errorMessage);
//     }

//     return {
//       message: "Everything went well sending the daily, see data for message breakdown...",
//       data: messagesSent
//     };
//   } catch (error) {
//     console.error(error.toString());
//     return {
//       message: `Error while sending slack message: ${error}`
//     };
//   }
// };

const constructDailyMessage = (user: { firstName: string, enteredHours: number, expectedHours: number }, numberOfToday: number, date: string): { message: string } => {
  const { firstName } = user;

  const { enteredHours, expectedHours } = TimeUtilities.handleTimeFormatting(user);

  const displayDate = DateTime.fromISO(date).toFormat("dd.MM.yyyy");

  const customMessage = `
Hi ${firstName},
${numberOfToday === 1 ? "Last friday" :"Yesterday"} (${displayDate}) you worked ${enteredHours} with an expected time of ${expectedHours};
`;

  return {
    message: customMessage
  };
};

export const sendDailyMessageHandler = async (): Promise<DailyHandlerResponse> => {
  try {
    const severaApi = CreateSeveraApiService();
    const severaUsers = await severaApi.getWorkhours();

    if (!severaUsers) {
      throw new Error("No persons retrieved from Severa");
    }

    const combinedUserData: DailyCombinedData[] = await Promise.all(
      Array.isArray(severaUsers) ? severaUsers.map(async user => {
        const workDays = await severaApi.getWorkDays(user.user.guid);
        const firstWorkDay = workDays[0];
        const expectedHours = firstWorkDay?.expectedHours || 0;
        const enteredHours = firstWorkDay?.enteredHours || 0;
        console.log(`Work Days for user ${user.user.guid}: `, workDays);
        // console.log(`Expected Hours for user ${user.user.guid}: `, expectedHours);
    
        return {
          userGuid: user.user.guid,
          firstName: user.user.firstName,
          enteredHours: enteredHours,
          expectedHours: expectedHours,
        };
      }) : []
    );

    // console.log("Combined User Data: ", combinedUserData);

    const dailyMessages = combinedUserData.map(user => constructDailyMessage(user, 1, DateTime.now().toISO()));
    return {
      message: "Daily messages constructed successfully",
      data: dailyMessages
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