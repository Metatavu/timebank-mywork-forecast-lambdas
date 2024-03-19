import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";
import { Task } from "src/apis/schemas/forecast/task";

/**
 * Parameters for lambda
 */
interface ListTasksParameters {
  projectId?: number,
  personId?: number
}

/**
 * Response schema for lambda
 */
interface Response {
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
const listTasks = async (api: ForecastApiService, parameters: ListTasksParameters): Promise<Response[]> => {
  let filteredTasks: Task[];

  if (parameters.projectId) {
    const tasks = await api.getTasksByProject(parameters.projectId);
    filteredTasks = tasks.filter(task => task.project_id === parameters.projectId);
  } else {
    filteredTasks = await api.getAllTasks();
    if (parameters.personId) filteredTasks = filteredTasks.filter((task => task.assigned_persons.includes(parameters.personId)));
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
      highPriority: task.high_priority,
      assignedPersons: task.assigned_persons,
    }
  });
}

/**
 * Lambda for listing Forecast tasks
 * 
 * @param event event
 */
const listTasksHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const api = CreateForecastApiService();
  const { queryStringParameters } = event;

  const tasks = await listTasks(api, {
    projectId: queryStringParameters && parseInt(queryStringParameters.projectId),
    personId: queryStringParameters && parseInt(queryStringParameters.personId)
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(tasks)
  };
};

export const main = middyfy(listTasksHandler);