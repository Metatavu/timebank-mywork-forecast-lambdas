import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";
import { FilterUtilities } from "src/libs/filter-utils";

/**
 * Parameters for lambda
 */
interface ListTimeEntriesParameters {
  projectId: number,
  startDate?: string,
  endDate?: string, 
  taskId?: string,
}

/**
 * Response schema for lambda
 */
interface Response {
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
    return FilterUtilities.filterByDate(
      {start_date: parameters.startDate, end_date: parameters.endDate}, 
      currentDate, 
      {startDate: new Date(timeEntry.date), endDate: new Date(timeEntry.date)}
      ) && FilterUtilities.filterByTask(timeEntry.task, parameters.taskId);
  });

  return filteredTimeEntries.map(timeEntry => {
    return {
      id: timeEntry.id,
      person: timeEntry.person,
      project: timeEntry.project,
      task: timeEntry.task,
      timeRegistered: timeEntry.time_registered,
      date: timeEntry.date
    }
  });
}

/**
 * Lambda for listing Forecast time entries
 * 
 * @param event event
 */
const listTimeEntriesHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { queryStringParameters } = event;

  if (!queryStringParameters && !queryStringParameters.projectId) {
    return {
      statusCode: 400,
      body: "Missing parameters"
    };
  }

  const api = CreateForecastApiService();
  
  const timeEntries = await listTimeEntries(api, {
    projectId: parseInt(queryStringParameters.projectId),
    startDate: queryStringParameters.startDate,
    endDate: queryStringParameters.endDate,
    taskId: queryStringParameters.taskId,
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(timeEntries)
  };
}

export const main = middyfy(listTimeEntriesHandler);