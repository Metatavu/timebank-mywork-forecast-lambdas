import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService, ForecastApiService } from 'src/apis/forecast-api-service';

interface Parameters {
  startDate?: Date,
  endDate?: Date,
  personId?: string,
  projectId?: string,
}

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

async function listAllocationsFunction(api: ForecastApiService, currentDate: Date, parameters: Parameters): Promise<Response[]> {
  const allocations = await api.getAllocations();

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
  });

  const responseAllocations = filteredAllocations.map(allocation => {
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

  return responseAllocations;
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

  const allocations = await listAllocationsFunction(api, new Date(), {
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