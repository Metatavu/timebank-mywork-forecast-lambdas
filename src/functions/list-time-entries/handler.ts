import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";

/**
 * Parameters for lambda
 */
export interface ListTimeEntriesParameters {
  projectId: number
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: number,
  person: number,
  project: number,
  task: number,
  timeRegistered: number;
}

/**
 * Gets time entries for a project
 * 
 * @param api Instance of ForecastApiService
 * @param parameters Parameters
 * @returns Array of time entries
 */
async function listTimeEntriesFunction(api: ForecastApiService, parameters: ListTimeEntriesParameters): Promise<Response[]> {
  const timeEntries = await api.getTimeEntriesByProject(parameters.projectId);

  return timeEntries.map(timeEntry => {
    return {
      id: timeEntry.id,
      person: timeEntry.person,
      project: timeEntry.project,
      task: timeEntry.task,
      timeRegistered: timeEntry.time_registered,
    }
  });
}

/**
 * Lambda for listing Forecast time entries
 * 
 * @param event event
 */
const listTimeEntries: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  // const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  // const auth = parseBearerAuth(authorization || Authorization);
  // if (!auth) {
  //   return {
  //     statusCode: 401,
  //     body: "Unauthorized"
  //   };
  // }

  if (!event.queryStringParameters.projectId) {
    return {
      statusCode: 400,
      body: "Invalid parameters"
    };
  }

  const api = CreateForecastApiService();
  
  const timeEntries = await listTimeEntriesFunction(api, {
    projectId: parseInt(event.queryStringParameters.projectId),
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(timeEntries)
  };
}

export const main = middyfy(listTimeEntries);