import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { FilterUtilities } from "@libs/filter-utils";
// import { parseBearerAuth } from '@libs/auth-utils';
import { isTokenValid } from "@libs/auth-utils";
import { middyfy } from "@libs/lambda";
import { ForecastApiService } from "src/apis/forecast-api-service";

/**
 * Parameters for lambda
 */
export interface ListProjectsParameters {
  startDate?: Date,
  endDate?: Date,
  projectId: number
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: number,
  name: string,
  stage: string,
  status: string,
  estimationUnits: string,
  minutesPerEstimationPoint: number,
  startDate: Date,
  endDate: Date,
}

/**
 * Gets and filters projects
 * 
 * @param api Instance of ForecastApiService
 * @param currentDate Current date
 * @param parameters Parameters
 * @returns Array of projects
 */
const listProjects = async (currentDate: Date, parameters: ListProjectsParameters): Promise<Response | Response[]> => {
  const projectsApi = await ForecastApiService.getProjectsApi();
  let allProjects: any[];

  if(parameters.projectId) {
    const project = await projectsApi.getProject(parameters);
      return {
        id: project.id,
        name: project.name,
        stage: project.stage,
        status: project.status,
        estimationUnits: project.estimationUnits,
        minutesPerEstimationPoint: project.minutesPerEstimationPoint,
        startDate: project.createdAt,
        endDate: project.endDate
      }  
  } else {
    allProjects = await projectsApi.getProjects(); 

    const filteredProjects = allProjects.filter(project => {
      return FilterUtilities.filterByDate(project, currentDate, parameters) && project.stage == "RUNNING"
    });
      return filteredProjects.map((project => {
        return {
          id: project.id,
          companyProjectId: project.companyProjectId,
          name: project.name,
          stage: project.stage,
          status: project.status,
          estimationUnits: project.estimationUnits,
          minutesPerEstimationPoint: project.minutesPerEstimationPoint,
          startDate: project.createdAt,
          endDate: project.endDate
        }  
      }))
    
  }
} 

/**
 * Lambda for listing Forecast projects
 * 
 * @param event event
 */
const listProjectsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { headers: { Authorization } } = event;
  const auth = await isTokenValid(Authorization);
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }
  const filteredProjects = await listProjects( new Date(), {
    projectId: Number(event.queryStringParameters.projectId),
    startDate: new Date(event.queryStringParameters.startDate),
    endDate: new Date(event.queryStringParameters.endDate)
  })
  
  return {
    statusCode: 200,
    body: JSON.stringify(filteredProjects)
  };
}

export const main = middyfy(listProjectsHandler);