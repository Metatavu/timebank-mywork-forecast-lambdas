import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import type FlextimeModel from "src/database/models/severa";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";

/**
 * @param event
 * @returns users flextime
 */
export const getFlextimeHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
) => {
  try {
    const userGuid = event.pathParameters?.userGuid;
    const eventDate = event.queryStringParameters?.eventDate;
    const api = CreateSeveraApiService();

    if (!userGuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Guid is required" }),
      };
    }

    const flexTimeByUser: FlextimeModel = await api.getFlextimeByUser(userGuid, eventDate);

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

export const main = getFlextimeHandler;