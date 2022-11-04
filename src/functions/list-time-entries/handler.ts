import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';

/**
 * Lambda for listing Forecast time entries
 * 
 * @param event event
 */
const listTimeEntries: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  // const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  // const auth = parseBearerAuth(authorization || Authorization);
  // if (!auth) {
  //   return {
  //     statusCode: 401,
  //     body: "Unauthorized"
  //   };
  // }

  // TODO implement functoin logic
  
  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
}

export const main = middyfy(listTimeEntries);