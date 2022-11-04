import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService } from 'src/apis/forecast-api-service';

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

  const api = CreateForecastApiService();
  const projects = await api.getProjects();

  const currentDate = new Date();

  const startDate = event.queryStringParameters.startDate;
  const endDate = event.queryStringParameters.endDate;

  const filteredProjects = projects.filter(project => {
    if (startDate) {
      if (project.start_date == null || new Date(startDate) <= new Date(project.start_date)) {
        return false;
      }
    } else if (project.start_date == null || currentDate <= new Date(project.start_date)) {
      return false;
    }

    if (endDate) {
        if (project.end_date == null || new Date(endDate) >= new Date(project.end_date)) {
          return false;
        }
    } else if (project.end_date == null || currentDate >= new Date(project.end_date)) {
      return false;
    }

    if (project.stage != "RUNNING") {
      return false;
    }

    return true;
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(filteredProjects)
  };
}

export const main = middyfy(listProjects);