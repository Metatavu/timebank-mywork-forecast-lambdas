import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import {  ForecastApiService } from "src/apis/forecast-api-service";
import { isTokenValid } from "@libs/auth-utils";

/**
 * Parameters for lambda
 */
export interface ListTasksParameters {
  projectId: number,
  taskId: number,
  childrenTask?: boolean
}

/**
 * Response schema for lambda
 */
export interface Response {
  id: number,
  title: string,
  description: string,
  projectId: any,
  remaining: number,
  estimate: number,
  startDate: any,
  endDate: any,
  highPriority: any,
  assignedPersons: string[],
}

/**
 * Gets tasks for a project
 * 
 * @param api Instance of ForecastApiService
 * @param parameters Parameters
 * @returns Array of tasks
 */
const listTasks = async (parameters: ListTasksParameters): Promise<Response | Response[]> => {
  const tasks = await ForecastApiService.getTasksApi();
  let filteredTasks: any[];

  if (parameters.projectId) {
    console.log(parameters.projectId);
    filteredTasks = await tasks.getTasksInProject(parameters); 
  } 
  // if (parameters.childrenTask && parameters.taskId) {
  //   filteredTasks = await tasks.getChildrenTasks(parameters);
  // } 
  if (parameters.taskId) {
    console.log(parameters.taskId);
    const task = await tasks.getTask(parameters)
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      remaining: task.remaining,
      estimate: task.estimate,
      startDate: task.startDate,
      endDate: task.endDate,
      highPriority: task.highPriority,
      assignedPersons: task.assignedPersons
    }
  }
  return filteredTasks.map(task => {
    return {
      id: task.id,
      companyTaskId: task.companyTaskId,
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      remaining: task.remaining,
      estimate: task.estimate,
      startDate: task.startDate,
      endDate: task.endDate,
      highPriority: task.highPriority,
      sprint: task.sprint,
      assignedPersons: task.assignedPersons
    };
  });
}

/**
 * Lambda for listing Forecast tasks
 * 
 * @param event event
 */
const listTasksHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const { headers: { Authorization } } = event;
  const auth = await isTokenValid(Authorization);
  if (!auth) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }
  const tasks = await listTasks({
    projectId: parseInt(event.queryStringParameters.projectId),
    taskId: parseInt(event.queryStringParameters.taskId)

  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(tasks)
  };
};

export const main = middyfy(listTasksHandler);