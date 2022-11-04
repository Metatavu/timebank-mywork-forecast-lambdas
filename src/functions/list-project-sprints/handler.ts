import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';

/**
 * Lambda for listing Forecast project sprints
 * 
 * @param event event
 */
const listProjectSprints: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  // const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  // const auth = parseBearerAuth(authorization || Authorization);
  // if (!auth) {
  //   return {
  //     statusCode: 401,
  //     body: "Unauthorized"
  //   };
  // }

  // TODO: Implement function logic
  
  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
}

export const main = middyfy(listProjectSprints);