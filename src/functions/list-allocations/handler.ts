import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService, ForecastApiService } from 'src/apis/forecast-api-service';

interface Parameters {
  startDate?: Date,
  endDate?: Date,
  personId: string,
  projectId: string,
}

async function listAllocationsFunction(api: ForecastApiService, getCurrentDate: () => Date, parameters: Parameters): Promise<any> {
  const allocations = await api.getAllocations();

  const currentDate = getCurrentDate();

  const filteredAllocations = allocations.filter(allocation => {
    if (parameters.startDate) {
      if (allocation.start_date == null || parameters.startDate <= new Date(allocation.start_date)) {
        return false;
      }
    } else if (allocation.start_date == null || currentDate <= new Date(allocation.start_date)) {
      return false;
    }

    if (parameters.endDate) {
        if (allocation.end_date == null || parameters.endDate >= new Date(allocation.end_date)) {
          return false;
        }
    } else if (allocation.end_date == null || currentDate >= new Date(allocation.end_date)) {
      return false;
    }

    if (parameters.projectId != null && allocation.project.toString() != parameters.projectId) {
      return false;
    }

    if (parameters.personId != null && allocation.person.toString() != parameters.personId) {
      return false;
    }

    return true;
  })

  return filteredAllocations;
}

/**
 * Lambda for listing Forecast allocations
 * 
 * @param event event
 */
const listAllocations: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  // const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  // const auth = parseBearerAuth(authorization || Authorization);
  // if (!auth) {
  //   return {
  //     statusCode: 401,
  //     body: "Unauthorized"
  //   };
  // }
  
  const api = CreateForecastApiService();

  let allocations = await listAllocationsFunction(api, () => new Date(), {
    startDate: new Date(event.queryStringParameters.start_date),
    endDate: new Date(event.queryStringParameters.endDate),
    personId: event.queryStringParameters.personId,
    projectId: event.queryStringParameters.projectId,
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(allocations)
  };
};

export const main = middyfy(listAllocations);