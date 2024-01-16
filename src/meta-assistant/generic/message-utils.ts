import { PersonTotalTime } from "src/generated/client/api";
import { CalculateWorkedTimeAndBillableHoursResponse, DailyCombinedData } from "src/types/meta-assistant";
import TimeUtilities from "src/meta-assistant/generic/time-utils";

/**
 * Namespace for message utilities
 */
namespace MessageUtilities {
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
}

export default MessageUtilities;