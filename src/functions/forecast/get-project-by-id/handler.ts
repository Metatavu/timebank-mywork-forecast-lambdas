import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";


/**
 * Response schema for lambda
 */
interface Response {
  id: number,
  name: string,
  startDate: string,
  endDate: string,
  status: string,
  stage: string,
  color: string
}

/**
 * Get a project by id
 *
 * @param api Instance of ForecastApiService
 * @param projectId project id
 * @returns  project
 */
const singleProject = async (api: ForecastApiService, projectId: string): Promise<Response> => {
  const project = await api.getProject(projectId);

  return {
    id: project.id,
    name: project.name,
    startDate: project.start_date,
    endDate: project.end_date,
    status: project.status,
    stage: project.stage,
    color: project.color
  }
}

/**
 * Lambda to request a Forecast project
 *
 * @param event event
 */
const getProjectHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const api = CreateForecastApiService();
  const { pathParameters } = event;
  if (!pathParameters.id) return {
    statusCode: 404,
    body: JSON.stringify("Not Found")
  }

  const project = await singleProject(api, pathParameters.id);
  if (project.id) return {
    statusCode: 200,
    body: JSON.stringify(project)
  }
  return {
    statusCode: 404,
    body: JSON.stringify("Not Found")
  }
};

export const main = middyfy(getProjectHandler);