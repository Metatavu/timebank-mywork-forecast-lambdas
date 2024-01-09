import { DailyCombinedData, Dates, TimeRegistrations, PreviousWorkdayDates, NonProjectTime, DisplayValues, CalculateWorkedTimeAndBillableHoursResponse } from "src/types/meta-assistant/index";
import { DateTime, Duration } from "luxon";
import { PersonTotalTime } from "src/generated/client/api";

/**
 * Namespace for time utilities
 */
namespace TimeUtilities {

  /**
   * Converts minutes into hours and minutes
   *
   * @param duration in minutes from timebank Data
   * @returns string of timebank data converted to hours and minutes
   */
  export const timeConversion = (duration: number): string => {
    const dur = Duration.fromObject({ minutes: duration });
    const time = dur.shiftTo("hours", "minutes");
    return `${time.hours}h ${time.minutes} minutes`;
  };

  /**
   * Generates dates and numbers for previous week
   *
   * @returns various date formats/ numbers for start and end of previous week
   */
  export const lastWeekDateProvider = (): Dates => {
    const startOfWeek = DateTime.now().startOf("week");

    const weekStartDate = startOfWeek.minus({ weeks: 1 });
    const weekEndDate = startOfWeek.minus({ days: 1 });

    return { weekEndDate: weekEndDate, weekStartDate: weekStartDate };
  };

  /**
   * Handle formatting multiple time variables
   *
   * @param user data from timebank
   * @returns human friendly time formats
   */
  export const handleTimeConversion = (user: PersonTotalTime): DisplayValues => {
    const { logged, expected, internalTime, balance, loggedProjectTime, billableProjectTime, nonBillableProjectTime } = user;

    const displayLogged = TimeUtilities.timeConversion(logged);
    const displayLoggedProject = TimeUtilities.timeConversion(loggedProjectTime);
    const displayExpected = TimeUtilities.timeConversion(expected);
    const displayDifference = TimeUtilities.timeConversion(balance);
    const displayBillableProject = TimeUtilities.timeConversion(billableProjectTime);
    const displayNonBillableProjectTime = TimeUtilities.timeConversion(nonBillableProjectTime);
    const displayInternal = TimeUtilities.timeConversion(internalTime);

    return {
      logged: displayLogged,
      loggedProject: displayLoggedProject,
      expected: displayExpected,
      difference: displayDifference,
      billableProject: displayBillableProject,
      nonBillableProject: displayNonBillableProjectTime,
      internal: displayInternal
    };
  };

  /**
   * Calculates worked time and billable hours
   *
   * @param user data from timebank
   * @returns a message based on the worked time and the percentage of billable hours
   */
  export const calculateWorkedTimeAndBillableHours = (user: PersonTotalTime | DailyCombinedData): CalculateWorkedTimeAndBillableHoursResponse => {
    const { balance, billableProjectTime, logged } = user;

    const billableHoursPercentage = logged === 0 ? "0" : (billableProjectTime/logged * 100).toFixed(0);

    const undertime = TimeUtilities.timeConversion(balance * -1);
    const overtime = TimeUtilities.timeConversion(balance);

    let message = "You worked the expected amount of time";
    if (balance > 0) {
      message = `Overtime: ${overtime}`;
    }

    if (balance < 0) {
      message = `Undertime: ${undertime}`;
    }

    return {
      message: message,
      billableHoursPercentage: billableHoursPercentage
    };
  };

  /**
   * Checks if user is away or is it first day back
   *
   * @param timeRegistrations All timeregistrations after the day before yesterday
   * @param personId Users id
   * @param expected Users expected amount of work
   * @param date Today either yesterday depending on if function is checking is user on vacation or is it first day back at work
   * @param nonProjectTimes List of non project times
   * @returns false if can't find a time registration
   */
  export const checkIfUserIsAwayOrIsItFirstDayBack = (
    timeRegistrations: TimeRegistrations[],
    personId: number,
    expected: number,
    date: string,
    nonProjectTimes: NonProjectTime[]
  ): boolean => {
    const personsTimeRegistration = timeRegistrations.find(timeRegistration =>
      timeRegistration.person === personId
      && timeRegistration.date === date
      && timeRegistration.time_registered === expected
    );

    if (!personsTimeRegistration) return false;

    return nonProjectTimes.map(nonProjectTime => nonProjectTime.id).includes(personsTimeRegistration.non_project_time);
  };

  /**
   * Gets two previous workdays
   *
   * @returns two previous workdays
   */
  export const getPreviousTwoWorkdays = (): PreviousWorkdayDates => {
    let today = DateTime.now();
    let dayOfWeek = new Date().getDay();

    let previousWorkDay = today.minus({ days: 1 }).toISODate();
    let dayBeforePreviousWorkDay = today.minus({ days: 2 }).toISODate();

    if (dayOfWeek === 1) {
      previousWorkDay = today.minus({ days: 3 }).toISODate();
      dayBeforePreviousWorkDay = today.minus({ days: 4 }).toISODate();
    }

    return {
      today: today.toISODate(),
      yesterday: previousWorkDay,
      numberOfToday: dayOfWeek,
      dayBeforeYesterday: dayBeforePreviousWorkDay
    };
  };
}

export default TimeUtilities;