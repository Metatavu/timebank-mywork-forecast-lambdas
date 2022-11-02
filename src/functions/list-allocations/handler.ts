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

  // Make forecast allocations API call
  const Forecast = ForecastApiServiceFactory.getService();

  const allocations = await Forecast.getAllocations();

  console.log("allocations is", allocations);

  // Format response
  // const responseAllocations = allocations.map(row => (
  //   {
  //     id: row.id,
  //     name: row.name,
  //     seedURLs: row.seedURLs,
  //     frequency: row.frequency,
  //   }
  // ));

  // console.log("It is runnning", authorization, Authorization);
  
  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
};

export const main = middyfy(listAllocations);