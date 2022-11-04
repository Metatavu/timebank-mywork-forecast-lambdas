import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService } from 'src/apis/forecast-api-service';

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

  const allocations = await api.getAllocations();

  const currentDate = new Date();

  const startDate = event.queryStringParameters.startDate;
  const endDate = event.queryStringParameters.endDate;
  const personId = event.queryStringParameters.personId;
  const projectId = event.queryStringParameters.projectId;

  const filteredAllocations = allocations.filter(allocation => {
    if (startDate) {
      if (allocation.start_date == null || new Date(startDate) <= new Date(allocation.start_date)) {
        return false;
      }
    } else if (allocation.start_date == null || currentDate <= new Date(allocation.start_date)) {
      return false;
    }

    if (endDate) {
        if (allocation.end_date == null || new Date(endDate) >= new Date(allocation.end_date)) {
          return false;
        }
    } else if (allocation.end_date == null || currentDate >= new Date(allocation.end_date)) {
      return false;
    }

    if (projectId != null && allocation.project.toString() != projectId) {
      return false;
    }

    if (personId != null && allocation.person.toString() != personId) {
      return false;
    }

    return true;
  })
  
  return {
    statusCode: 200,
    body: JSON.stringify(filteredAllocations)
  };
};

export const main = middyfy(listAllocations);