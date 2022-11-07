import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { parseBearerAuth } from '@libs/auth-utils';
import { middyfy } from '@libs/lambda';
import { CreateForecastApiService, ForecastApiService } from 'src/apis/forecast-api-service';

interface Parameters {
  projectId: number,
}

interface Response {
  id: number,
  name: string,
  startDate: string,
  endDate: string,
}

async function listProjectSprintsFunction(api: ForecastApiService, parameters: Parameters): Promise<Response[]> {
  const sprints = await api.getProjectSprints(parameters.projectId);

  const filteredSprints = sprints.filter(sprint => sprint.id == parameters.projectId);

  const responseSprints = filteredSprints.map(sprint => {
    return {
      id: sprint.id,
      name: sprint.name,
      startDate: sprint.start_date,
      endDate: sprint.end_date,
    };
  });

  return responseSprints;
}

/**
 * Lambda for listing Forecast project sprints
 * 
 * @param event event
 */
const listProjectSprints: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
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

  const projectSprints = await listProjectSprintsFunction(api, {
    projectId: +event.queryStringParameters.projectId
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(projectSprints)
  };
}

export const main = middyfy(listProjectSprints);