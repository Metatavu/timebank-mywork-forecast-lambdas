import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { ForecastApiServiceFactory } from 'src/apis/forecast-api-service-factory';

/**
 * Lambda for listing Forecast projects
 * 
 * @param event event
 */
const listProjects: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
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

  const projects = await api.getProjects();

  const currentDate = new Date();

  const filteredProjects = projects.filter(project => {
    return new Date(project.start_date) <= currentDate 
      && new Date(project.end_date) >= currentDate
      && project.stage == "RUNNING";
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(filteredProjects)
  };
}

export const main = middyfy(listProjects);