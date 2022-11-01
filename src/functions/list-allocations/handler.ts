import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';

/**
 * Lambda for listing Forecast allocations
 * 
 * @param event event
 */
const listAllocations: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  const auth = parseBearerAuth(authorization || Authorization);
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  // Make forecast allocations API call
  // const allocations =

  // Format response
  // const responseAllocations = allocations.map(row => (
  //   {
  //     id: row.id,
  //     name: row.name,
  //     seedURLs: row.seedURLs,
  //     frequency: row.frequency,
  //   }
  // ));
  
  return {
    statusCode: 200,
    body: JSON.stringify(responseAllocations)
  };
};

export const main = middyfy(listAllocations);