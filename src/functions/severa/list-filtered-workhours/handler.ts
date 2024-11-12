import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";
import type WorkHours from "@database/models/workHours";


/**
 * Handler for getting work hours Severa REST API.
 *
 * @param event - API Gateway event containing the user GUID.
 */
export const getWorkHoursHandler: APIGatewayProxyHandler = async (event) => {
  
  // const severaProjectId = event.pathParameters?.severaProjectGuid;
  const severaUserId = event.pathParameters?.severaUserId;
  const severaProjectId = event.pathParameters?.severaProjectId;
  const severaPhaseId = event.pathParameters?.severaPhaseId;

  // console.log("severaProjectId", severaProjectId)
  // console.log("severaUserGuid", severaUserGuid)
  
  try {
    const api = CreateSeveraApiService();
    const response: WorkHours[] = await api.getWorkHoursBySeveraId(severaProjectId, severaUserId, severaPhaseId);

    const workHoursByUserId = JSON.parse(JSON.stringify(response))

    return {
      statusCode: 200,
      body: workHoursByUserId,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getWorkHoursHandler);