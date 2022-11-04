import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';

async function listTasksFunction(): Promise<any> {

} 

/**
 * Lambda for listing Forecast tasks
 * 
 * @param event event
 */
const listTasks: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  // const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  // const auth = parseBearerAuth(authorization || Authorization);
  // if (!auth) {
  //   return {
  //     statusCode: 401,
  //     body: "Unauthorized"
  //   };
  // }

  // TODO implement function logic

  // Format response
  // const responseTasks = tasks.map(row => (
  //   {
  //     id: row.id,
  //     name: row.name,
  //     seedURLs: row.seedURLs,
  //     frequency: row.frequency,
  //   }
  // ));

  let tasks = await listTasksFunction();
  
  return {
    statusCode: 200,
    body: JSON.stringify(tasks)
  };
};

export const main = middyfy(listTasks);