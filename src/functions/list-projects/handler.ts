import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { filterByDate } from "@libs/filter-utils";
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";

/**
 * Parameters for lambda
 */
export interface ListProjectsParameters {
  startDate?: Date,
  endDate?: Date,
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: number,
  name: string,
  startDate: string,
  endDate: string,
}

/**
 * Gets and filters projects
 * 
 * @param api Instance of ForecastApiService
 * @param currentDate Current date
 * @param parameters Parameters
 * @returns Array of projects
 */
async function listProjectsFunction(api: ForecastApiService, currentDate: Date, parameters: ListProjectsParameters): Promise<Response[]> {
  const projects = await api.getProjects();

  const filteredProjects = projects.filter(project => {
    if (filterByDate(project, currentDate, parameters) && project.stage == "RUNNING") {
      return true;
    }

    return false;
  });

  return filteredProjects.map(project => {
    return {
      id: project.id,
      name: project.name,
      startDate: project.start_date,
      endDate: project.end_date,
    }
  })
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