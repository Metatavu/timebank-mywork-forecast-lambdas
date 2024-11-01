import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service-TEMP";
import { middyfy } from "src/libs/lambda";
import WorkHours from "@database/models/workHours";

/**
 * Handler for getting work hours by user from Severa REST API.
 *
 * @param event - API Gateway event containing the user GUID.
 */
export const getWorkHoursBySeveraUserGuidHandler: APIGatewayProxyHandler = async (event) => {
  const severaUserGuid = event.pathParameters?.severaUserGuid;
  try {
    const api = CreateSeveraApiService();
    if (!severaUserGuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Guid is required" }),
      };
    }

    const response: WorkHours[] = await api.getWorkHoursBySeveraUserGuid(severaUserGuid);
    const workHoursByUserGuid = JSON.parse(JSON.stringify(response))

    return {
      statusCode: 200,
      body: workHoursByUserGuid,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getWorkHoursBySeveraUserGuidHandler);