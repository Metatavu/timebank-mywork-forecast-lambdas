import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService, ForecastApiService } from 'src/apis/forecast-api-service';

interface Parameters {
  startDate?: Date,
  endDate?: Date,
}

async function listProjectsFunction(api: ForecastApiService, currentDate: Date, parameters: Parameters): Promise<any> {
  const projects = await api.getProjects();

  const filteredProjects = projects.filter(project => {
    if (parameters.startDate) {
      if (project.start_date == null || new Date(parameters.startDate) <= new Date(project.start_date)) {
        return false;
      }
    } else if (project.start_date == null || currentDate <= new Date(project.start_date)) {
      return false;
    }

    if (parameters.endDate) {
        if (project.end_date == null || new Date(parameters.endDate) >= new Date(project.end_date)) {
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

  return filteredProjects;
} 

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

  const filteredProjects = await listProjectsFunction(api, new Date(), {
    startDate: new Date(event.queryStringParameters.startDate),
    endDate: new Date(event.queryStringParameters.endDate),
  })
  
  return {
    statusCode: 200,
    body: JSON.stringify(filteredProjects)
  };
}

export const main = middyfy(listProjects);