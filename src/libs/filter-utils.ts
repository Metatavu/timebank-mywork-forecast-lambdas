import { DateRange } from "src/types";

export namespace FilterUtilities {
  /**
   * Does various checks to see if currentDate or specified date is between Forecast dates
   * 
   * @param dateRange Date range from forecast
   * @param currentDate Current date
   * @param parameters Dates to compare
   * @returns If specified dates were null or not, if specified date parameters were between Forecast dates or if currentDate is between Forecast dates
   */
  export const filterByDate = (dateRange: DateRange, currentDate: Date, parameters: { startDate?: Date, endDate?: Date }): boolean => {
    if (dateRange.start_date === null) {
      return false;
    }
    const startDate = new Date(dateRange.start_date);
    let endDate = new Date(dateRange.end_date);
    
    if (dateRange.end_date === null) endDate = currentDate;
    if (parameters.startDate && parameters.startDate <= startDate) {
      return false;
    } else if (currentDate <= startDate) {
      return false;
    }

    if (parameters.endDate && parameters.endDate >= endDate) {
      return false;
    } else if (currentDate > endDate) {
      return false;
    }

    return true;
  }

  /**
   * Compares Forecast project id to specified id
   * 
   * @param project Project id from Forecast
   * @param projectId Project id to compare
   * @returns 
   */
  export const filterByProject = (project?: number, projectId?: string): boolean => {
    if (projectId !== undefined && project?.toString() !== projectId) {
      return false;
    }

    return true;
  }

  /**
   * Compares Forecast person id to specified id
   * 
   * @param person Person id from Forecast
   * @param personId Person id to compare
   * @returns If two parameters match or personId is null
   */
  export const filterByPerson = (person?: number, personId?: string): boolean => {
    if (personId !== undefined && person.toString() !== personId) {
      return false;
    }

    return true;
  }

  /**
   * Compares Forecast task id to specified id
   * 
   * @param task Task id from Forecast
   * @param taskId Task id to compare
   * @returns If two parameters match or task is null
   */
  export const filterByTask = (task?: number, taskId?: string) => {
    if (taskId && task.toString() !== taskId) return false;
    return true;
  }
}