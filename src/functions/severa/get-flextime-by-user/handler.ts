import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import type Flextime from "src/database/models/severa";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for getting flextime by user from Severa REST API.
 * 
 * @param event - API Gateway event containing the user GUID.
 */
export const getFlextimeHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
) => {
  try {
    const severaGuid = event.pathParameters?.severaGuid;
    const api = CreateSeveraApiService();

    if (!severaGuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Guid is required" }),
      };
    }

    const flexTimeByUser: Flextime = await api.getFlextimeByUser(severaGuid);

    return {
      statusCode: 200,
      body: JSON.stringify(flexTimeByUser),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getFlextimeHandler);