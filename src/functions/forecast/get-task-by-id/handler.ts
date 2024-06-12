import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CreateForecastApiService, ForecastApiService } from "src/apis/forecast-api-service";
import { Workflow } from "src/apis/schemas/forecast/workflow";

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
  status: string,
  statusCategory: string
}

/**
 * Gets task by id
 * 
 * @param api Instance of ForecastApiService
 * @param taskId task id
 * @returns task
 */
const singleTask = async (api: ForecastApiService, taskId: string): Promise<Response> => {
  let workflowStatuses: Workflow[] = [];
  let status: Workflow;
  const task = await api.getTask(taskId);
  if (task.project_id) workflowStatuses = await api.getWorkflowStatusByProject(task.project_id);
  if (workflowStatuses.length !== 0) status = workflowStatuses.find((status)=>{return status.id === task.workflow_column});
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
    status: status?.name || "",
    statusCategory: status?.category || ""
  }
}

/**
 * Lambda to request a Forecast task
 *
 * @param event event
 */
const getTaskHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  const api = CreateForecastApiService();
  const { pathParameters } = event;
  if (!pathParameters.id) return {
    statusCode: 404,
    body: JSON.stringify("Not Found")
  }

  const task = await singleTask(api, pathParameters.id);
  if (task.id) return {
    statusCode: 200,
    body: JSON.stringify(task)
  }
  return {
    statusCode: 404,
    body: JSON.stringify("Not Found")
  }
};

export const main = middyfy(getTaskHandler);