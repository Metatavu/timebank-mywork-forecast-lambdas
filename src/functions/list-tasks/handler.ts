import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService, ForecastApiService } from 'src/apis/forecast-api-service';

interface Parameters {
  projectId: number,
}

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

async function listTasksFunction(api: ForecastApiService, parameters: Parameters): Promise<Response[]> {
  if (parameters.projectId != null) {
    const tasks = await api.getTasks(parameters.projectId);

    var filteredTasks = tasks.filter(task => task.project_id == parameters.projectId);
  } else {
    var filteredTasks = await api.getAllTasks();
  }

  const responseTasks = filteredTasks.map(task => {
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

  return responseTasks;
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
    projectId: +event.queryStringParameters.projectId,
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(tasks)
  };
};

export const main = middyfy(listTasks);