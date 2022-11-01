import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';

/**
 * Lambda for listing Forecast projects
 * 
 * @param event event
 */
const listProjects: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  const auth = parseBearerAuth(authorization || Authorization);
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  // Make forecast projects API call
  // const projects =

  // Format response
  // const responseProjects = projects.map(row => (
  //   {
  //     id: row.id,
  //     name: row.name,
  //     seedURLs: row.seedURLs,
  //     frequency: row.frequency,
  //   }
  // ));
  
  return {
    statusCode: 200,
    body: JSON.stringify(responseProjects)
  };
};

export const main = middyfy(listProjects);