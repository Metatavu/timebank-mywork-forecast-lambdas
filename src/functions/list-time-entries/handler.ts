import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { ForecastApiService } from "src/apis/forecast-api-service";
import { isTokenValid } from "@libs/auth-utils";
import { FilterUtilities } from "@libs/filter-utils";

/**
 * Parameters for lambda
 */
export interface ListTimeEntriesParameters {
  projectId: number,
  personId: number
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
 * @param parameters Parameters
 * @returns Array of time entries
 */
const listTimeEntries = async (currentDate: Date, parameters: ListTimeEntriesParameters): Promise<Response | Response[]> => {
  const allTimeEntries = await ForecastApiService.getTimeRegistrationsApi();

    const timeRegisterations = await allTimeEntries.getAllTimeRegistrationsInAProject(parameters)

    const filteredTimeRegisterations = timeRegisterations.filter(timeRegisteration => {
      return FilterUtilities.filterByPerson(timeRegisteration.person, parameters.personId)
    });
    return filteredTimeRegisterations.map(timeEntry => {
      return {
        id: timeEntry.id,
        person: timeEntry.person,
        project: timeEntry.project,
        task: timeEntry.task,
        timeRegistered: timeEntry.timeRegistered,
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
  const { headers: { Authorization } } = event;
  const auth = await isTokenValid(Authorization);
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }
  
  const timeEntries = await listTimeEntries( new Date(), {
    projectId: parseInt(event.queryStringParameters.projectId),
    personId: parseInt(event.queryStringParameters.personId)
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(timeEntries)
  };
}

export const main = middyfy(listTimeEntriesHandler);