import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';

async function listTimeEntriesFunction(): Promise<any> {

}

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

  const timeEntries = await listTimeEntriesFunction();
  
  return {
    statusCode: 200,
    body: JSON.stringify(timeEntries)
  };
}

export const main = middyfy(listTimeEntries);