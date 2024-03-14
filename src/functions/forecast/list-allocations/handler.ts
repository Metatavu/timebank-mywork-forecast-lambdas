import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { FilterUtilities } from "@libs/filter-utils";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";

/**
 * Parameters for lambda
 */
export interface ListAllocationsParameters {
  startDate?: Date,
  endDate?: Date,
  personId?: string,
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
const listAllocations = async (api: ForecastApiService, currentDate: Date, parameters: ListAllocationsParameters): Promise<Response[]> => {
  const allocations = await api.getAllocations();

  const filteredAllocations = allocations.filter(allocation => {
    return FilterUtilities.filterByDate(allocation, currentDate, parameters)
        && FilterUtilities.filterByProject(allocation.project, parameters.projectId)
        && FilterUtilities.filterByPerson(allocation.person, parameters.personId);
  });

  return filteredAllocations.map(allocation => {
    return {
      id: allocation.id,
      project: allocation.project,
      person: allocation.person,
      startDate: allocation.start_date,
      endDate: allocation.end_date,
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

  const api = CreateForecastApiService();
  let startDateParameter =  new Date();
  let endDateParameter =  new Date();

  if (event.queryStringParameters.startDate){
    try {
      startDateParameter = new Date(event.queryStringParameters.startDate);
    } catch {
      startDateParameter = new Date();
    }
  }
  if (event.queryStringParameters.endDate){
    try {
      endDateParameter = new Date(event.queryStringParameters.endDate);
    } catch {
      endDateParameter = new Date();
    }
  }

  const allocations = await listAllocations(api, new Date(), {
    startDate: startDateParameter,
    endDate: endDateParameter,
    personId: event.queryStringParameters.personId ? event.queryStringParameters.personId : undefined,
    projectId: event.queryStringParameters.projectId ? event.queryStringParameters.projectId : undefined,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(allocations)
  };
};

export const main = middyfy(listAllocationsHandler);