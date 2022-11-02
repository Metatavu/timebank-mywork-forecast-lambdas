import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { ForecastApiServiceFactory } from 'src/apis/forecast-api-service-factory';

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
  
  const api = ForecastApiServiceFactory.getService();

  const allocations = await api.getAllocations();

  const currentDate = new Date();

  const projectId = event.pathParameters.projectId;
  const personId = event.pathParameters.personId;

  const filteredAllocations = allocations.filter(allocation => {
    return new Date(allocation.start_date) <= currentDate 
      && new Date(allocation.end_date) >= currentDate
      && allocation.project.toString() == projectId
      && allocation.person.toString() == personId;
  })
  
  return {
    statusCode: 200,
    body: JSON.stringify(allocations)
  };
};

export const main = middyfy(listAllocations);