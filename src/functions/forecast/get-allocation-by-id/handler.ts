import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";


/**
 * Response schema for lambda
 */
interface Response {
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
 * Get an allocation by id
 *
 * @param api Instance of ForecastApiService
 * @param allocationId allocation id
 * @returns  allocation
 */
const singleAllocation = async (api: ForecastApiService, allocationId: string): Promise<Response> => {
  const allocation = await api.getAllocation(allocationId);

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
}

/**
 * Lambda to request a Forecast allocation
 *
 * @param event event
 */
const getAllocationHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const api = CreateForecastApiService();
  const { pathParameters } = event;
  if (!pathParameters.id) return {
    statusCode: 404,
    body: JSON.stringify("Not Found")
  }

  const allocation = await singleAllocation(api, pathParameters.id);
  if (allocation.id) return {
    statusCode: 200,
    body: JSON.stringify(allocation)
  }
  return {
    statusCode: 404,
    body: JSON.stringify("Not Found")
  }
};

export const main = middyfy(getAllocationHandler);