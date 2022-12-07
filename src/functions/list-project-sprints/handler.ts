import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { ForecastApiService } from "src/apis/forecast-api-service";
import { isTokenValid } from "@libs/auth-utils";

/**
 * Parameters for lambda
 */
export interface ListProjectSprintsParameters {
  projectId: number,
  sprintId: number
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: number,
  name: string,
  startDate: Date,
  endDate: Date,
}

/**
 * Gets sprints for a project
 * 
 * @param api Instance of ForecastApiService
 * @param parameters Parameters
 * @returns Array of sprints
 */
const listProjectSprints = async (parameters: ListProjectSprintsParameters): Promise<Response | Response[]> => {
  let filteredSprints: any[];

  const sprints = await ForecastApiService.getSprintsApi();
  if (parameters.sprintId && parameters.projectId) {
  const sprint = await sprints.getProjectSprint(parameters);
    return {
      id: sprint.id,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    }
  } if (parameters.projectId && !parameters.sprintId) {
  filteredSprints = await sprints.getProjectSprints(parameters);
    return (await filteredSprints).map(sprint => {
      return {
        id: sprint.id,
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
      };
    });
  }
};

/**
 * Lambda for listing Forecast project sprints
 * 
 * @param event event
 */
const listProjectSprintsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { headers: { Authorization } } = event;
  const auth = await isTokenValid(Authorization);
  
  if (!event.queryStringParameters.projectId) {
    return {
      statusCode: 400,
      body: "Invalid parameters"
    };
  }
  
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  const projectSprints = await listProjectSprints({
    projectId: parseInt(event.queryStringParameters.projectId),
    sprintId: parseInt(event.queryStringParameters.sprintId)
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(projectSprints)
  };
}

export const main = middyfy(listProjectSprintsHandler);