import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';

/**
 * Lambda for listing Forecast tasks
 * 
 * @param event event
 */
const listTasks: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  const auth = parseBearerAuth(authorization || Authorization);
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  // Make forecast tasks API call
  // const tasks =

  // Format response
  // const responseTasks = tasks.map(row => (
  //   {
  //     id: row.id,
  //     name: row.name,
  //     seedURLs: row.seedURLs,
  //     frequency: row.frequency,
  //   }
  // ));
  
  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
};

export const main = middyfy(listTasks);