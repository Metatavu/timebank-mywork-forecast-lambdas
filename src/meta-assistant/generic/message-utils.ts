import { PersonTotalTime } from "src/generated/client/api";
import { CalculateWorkedTimeAndBillableHoursResponse, DailyCombinedData } from "src/types/meta-assistant";
import TimeUtilities from "src/meta-assistant/generic/time-utils";
import { TotalTime } from "./model";

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
  export const calculateWorkedTimeAndBillableHours = (user: TotalTime| DailyCombinedData): CalculateWorkedTimeAndBillableHoursResponse => {
    const { quantity, billableTime, enteredHours } = user;

    const billableHoursPercentage = enteredHours === 0 ? "0" : (billableTime/enteredHours * 100).toFixed(0);

    const undertime = TimeUtilities.timeConversion(quantity * -1);
    const overtime = TimeUtilities.timeConversion(quantity);

    let message = "You worked the expected amount of time";
    if (quantity > 0) {
      message = `Overtime: ${overtime}`;
    }

    if (quantity < 0) {
      message = `Undertime: ${undertime}`;
    }

    return {
      message: message,
      billableHoursPercentage: billableHoursPercentage
    };
  };
}

export default MessageUtilities;