import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";
import { FilterUtilities } from "src/libs/filter-utils";

/**
 * Parameters for lambda
 */
export interface ListTimeEntriesParameters {
  projectId: number,
  startDate?: string,
  endDate?: string, 
  taskId?: string,
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: number,
  person: number,
  project: number,
  task: number,
  timeRegistered: number,
  date: string,
}

/**
 * Gets time entries for a project
 * 
 * @param api Instance of ForecastApiService
 * @param parameters Parameters
 * @returns Array of time entries
 */
const listTimeEntries = async (api: ForecastApiService, parameters: ListTimeEntriesParameters): Promise<Response[]> => {
  const timeEntries = await api.getTimeEntriesByProject(parameters.projectId);
  const currentDate = new Date();

  const filteredTimeEntries = timeEntries.filter(timeEntry => {
    return FilterUtilities.filterByDate({start_date: parameters.startDate, end_date: parameters.endDate}, currentDate, {startDate: new Date(timeEntry.date), endDate: new Date(timeEntry.date)})
    && FilterUtilities.filterByTask(timeEntry.task, parameters.taskId);
  });

  return filteredTimeEntries.map(timeEntry => {
    return {
      id: timeEntry.id,
      person: timeEntry.person,
      project: timeEntry.project,
      task: timeEntry.task,
      timeRegistered: timeEntry.time_registered,
      date: timeEntry.date,
    }
  });
}

/**
 * Lambda for listing Forecast time entries
 * 
 * @param event event
 */
const listTimeEntriesHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  if (!event.queryStringParameters.projectId) {
    return {
      statusCode: 400,
      body: "Invalid parameters"
    };
  }

  const api = CreateForecastApiService();
  
  const timeEntries = await listTimeEntries(api, {
    projectId: parseInt(event.queryStringParameters.projectId),
    startDate: event.queryStringParameters.startDate ? event.queryStringParameters.startDate : undefined,
    endDate: event.queryStringParameters.endDate ? event.queryStringParameters.endDate : undefined,
    taskId: event.queryStringParameters.taskId ? event.queryStringParameters.taskId : undefined,
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(timeEntries)
  };
}

export const main = middyfy(listTimeEntriesHandler);