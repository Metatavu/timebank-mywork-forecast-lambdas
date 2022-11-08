import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { parseBearerAuth } from "@libs/auth-utils";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";
import { Task } from "src/apis/schemas/task";

/**
 * Parameters for lambda
 */
export interface ListTasksParameters {
  projectId: number,
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: string,
  title: string,
  description: string,
  projectId: number,
  remaining: number,
  estimate: number,
  startDate: string,
  endDate: string,
  highPriority: boolean,
  assignedPersons: number[],
}

/**
 * Gets tasks for a project
 * 
 * @param api Instance of ForecastApiService
 * @param parameters Parameters
 * @returns Array of tasks
 */
async function listTasksFunction(api: ForecastApiService, parameters: ListTasksParameters): Promise<Response[]> {
  let filteredTasks: Task[];

  if (parameters.projectId !== null) {
    const tasks = await api.getTasksByProject(parameters.projectId);

    filteredTasks = tasks.filter(task => task.project_id === parameters.projectId);
  } else {
    filteredTasks = await api.getAllTasks();
  }

  return filteredTasks.map(task => {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      projectId: task.project_id,
      remaining: task.remaining,
      estimate: task.estimate,
      startDate: task.start_date,
      endDate: task.end_date,
      highPriority: task.highPriority,
      assignedPersons: task.assignedPersons,
    }
  });
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

  const api = CreateForecastApiService();

  const tasks = await listTasksFunction(api, {
    projectId: parseInt(event.queryStringParameters.projectId),
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(tasks)
  };
};

export const main = middyfy(listTasks);