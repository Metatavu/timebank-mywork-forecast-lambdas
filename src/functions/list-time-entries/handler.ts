import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService, ForecastApiService } from 'src/apis/forecast-api-service';

interface Parameters {
  projectId: number
}

interface Response {
  id: number,
  person: number,
  project: number,
  task: number,
  timeRegistered: number;
}

async function listTimeEntriesFunction(api: ForecastApiService, parameters: Parameters): Promise<Response[]> {
  const timeEntries = await api.getTimeEntries(parameters.projectId);

  const responseTimeEntries = timeEntries.map(timeEntry => {
    return {
      id: timeEntry.id,
      person: timeEntry.person,
      project: timeEntry.project,
      task: timeEntry.task,
      timeRegistered: timeEntry.time_registered,
    }
  })

  return responseTimeEntries;
}

/**
 * Lambda for listing Forecast time entries
 * 
 * @param event event
 */
const listTimeEntries: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
  // const { headers: { authorization, Authorization } } = event;

  // TODO: parseBearerAuth not working yet
  // const auth = parseBearerAuth(authorization || Authorization);
  // if (!auth) {
  //   return {
  //     statusCode: 401,
  //     body: "Unauthorized"
  //   };
  // }

  if (!event.queryStringParameters.projectId) {
    return {
      statusCode: 400,
      body: "Invalid parameters"
    };
  }

  const api = CreateForecastApiService();
  
  const timeEntries = await listTimeEntriesFunction(api, {
    projectId: +event.queryStringParameters.projectId
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(timeEntries)
  };
}

export const main = middyfy(listTimeEntries);