import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { isTokenValid } from "@libs/auth-utils";
import { FilterUtilities } from "@libs/filter-utils";
import { middyfy } from "@libs/lambda";
import { ForecastApiService } from "src/apis/forecast-api-service";

/**
 * Parameters for lambda
 */
export interface ListAllocationsParameters {
  startDate?: Date,
  endDate?: Date,
  personId?: number,
  projectId?: string,
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: number,
  project: number,
  person: number,
  startDate: string,
  endDate: string,
  monday: number,
  tuesday: number,
  wednesday: number,
  thursday: number,
  friday: number,
  notes: string,
}

/**
 * Gets and filters allocations
 * 
 * @param api Instance of ForecastApiService
 * @param currentDate Current date
 * @param parameters Parameters
 * @returns Array of allocations
 */
const listAllocations = async (currentDate: Date, parameters: ListAllocationsParameters): Promise<Response | Response[]> => {
  const allocations = await ForecastApiService.getAllocationsApi();
  let allAllocations: any[];
  allAllocations = await allocations.getAllocations();
  const filteredAllocations = allAllocations.filter(allocation => {
    return FilterUtilities.filterByPerson(allocation.person, parameters.personId)
        && FilterUtilities.filterByDate(allocation, currentDate, parameters);
        // && FilterUtilities.filterByProject(allocation.project, parameters.projectId);
  });

  return filteredAllocations.map(allocation => {
    return {
      id: allocation.id,
      project: allocation.project,
      person: allocation.person,
      startDate: allocation.startDate,
      endDate: allocation.endDate,
      monday: allocation.monday,
      tuesday: allocation.tuesday,
      wednesday: allocation.wednesday,
      thursday: allocation.thursday,
      friday: allocation.friday,
      notes: allocation.notes,
    }
  });
}

/**
 * Lambda for listing Forecast allocations
 * 
 * @param event event
 */
const listAllocationsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { headers: { Authorization } } = event;

  const auth = await isTokenValid(Authorization);
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  const allocations = await listAllocations( new Date(), {
    startDate: new Date(event.queryStringParameters.startDate),
    endDate: new Date(event.queryStringParameters.endDate),
    personId: parseInt(event.queryStringParameters.personId),
    projectId: event.queryStringParameters.projectId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(allocations)
  };
};

export const main = middyfy(listAllocationsHandler);