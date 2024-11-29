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

// const constructDailyMessage = (user: { firstName: string, enteredHours: number, expectedHours: number }, numberOfToday: number, date: string): { message: string } => {
//   const { firstName } = user;

//   const { enteredHours, expectedHours } = TimeUtilities.handleTimeFormatting(user);

//   const displayDate = DateTime.fromISO(date).toFormat("dd.MM.yyyy");

//   const customMessage = `
// Hi ${firstName},
// ${numberOfToday === 1 ? "Last friday" :"Yesterday"} (${displayDate}) you worked ${enteredHours} with an expected time of ${expectedHours};
// `;

//   return {
//     message: customMessage
//   };
// };

export const sendDailyMessageHandler = async (): Promise<DailyHandlerResponse> => {
  let totalBillableTime = 0;

  try {
    const severaApi = CreateSeveraApiService();
    const severaUsers = await severaApi.getUsers();
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const projectHours = await severaApi.getProjectHours("f7d6b20f-20a7-8abc-b9af-527537a6f197");
    const workHours = await severaApi.getWorkhours();
    if (!severaUsers) {
      throw new Error("No persons retrieved from Severa");
    }
    // console.log("Work Hours: ", workHours);
    // console.log("Severa Users: ", severaUsers);

    // Extract user GUIDs from projectHours
    const projectUserGuids = Array.isArray(projectHours) ? projectHours.map(hour => hour.user.guid) : [];

    // Filter severaUsers to include only those found in projectHours
    const filteredSeveraUsers = Array.isArray(severaUsers) ? severaUsers.filter(user => projectUserGuids.includes(user.guid)) : [];

    // Filter workHours to specific date
    // const filteredWorkHours = Array.isArray(workHours) ? workHours.filter(hour => hour.eventDate === "2024-11-26") : [];
    // console.log("Project Hours: ", projectHours);
    console.log("Filtered Severa Users: ", filteredSeveraUsers);
    // console.log("Filtered Work Hours: ", filteredWorkHours);

    const combinedUserData: DailyCombinedData[] = await Promise.all(
      Array.isArray(filteredSeveraUsers) ? filteredSeveraUsers.map(async user => {
        const userWorkHours = Array.isArray(workHours) ? workHours.filter(hour => hour.user.guid === user.guid) : [];
        const workDays = await severaApi.getWorkDays(user.guid);
        const quantity = userWorkHours[0]?.quantity || 0;
        const isBillable = user.isBillable;
        const enteredHours = workDays[0]?.enteredHours || 0;
        const billableTime = isBillable ? enteredHours + quantity : enteredHours - quantity || 0;
        const expectedHours = user.workContract.dailyHours || 0;
        const minimumBillableRate = 0;

        Array.isArray(workHours) && workHours.forEach(hour => {
        if (hour.isBillable) {
          totalBillableTime += hour.quantity;
        }
        });

        // console.log("User Workdays: ", workDays);
        console.log("Total BillableTime: ", totalBillableTime);
        // console.log(`Expected Hours for user ${user.user.guid}: `, expectedHours);
        return {
          userGuid: user.guid,
          firstName: user.firstName,
          enteredHours: enteredHours,
          expectedHours: expectedHours,
          quantity: quantity,
          billableTime: billableTime,
          minimumBillableRate: minimumBillableRate,
          totalBillableTime: totalBillableTime,
          date: DateTime.now().minus({ days: 1 }).toISODate()
        };
      }) : []
    );

    console.log("Combined User Data: ", combinedUserData);
    const messageSent = await SlackUtilities.postDailyMessageToUsers(combinedUserData, previousWorkDays);

    // const dailyMessages = combinedUserData.map(user => constructDailyMessage(user, 1, DateTime.now().toISO()));
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