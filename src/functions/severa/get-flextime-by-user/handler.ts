import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for getting flextime by user from Severa REST API.
 * 
 * @param event - API Gateway event containing the user Id.
 */
export const getFlextimeHandler: APIGatewayProxyHandler = async (event) => {
  const severaUserId = event.pathParameters?.severaUserId;
  const eventDateParam = event.queryStringParameters?.eventDate;

  try {
    const api = CreateSeveraApiService();

    if (!severaUserId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Id is required" }),
      };
    }

    const eventDate = eventDateParam || new Date().toISOString();

    const flexTimeBySeveraId = await api.getFlextimeBySeveraUserId(severaUserId, eventDate);

    return {
      statusCode: 200,
      body: JSON.stringify(flexTimeBySeveraId),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getFlextimeHandler);