import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for getting flextime by user from Severa REST API.
 * 
 * @param event - API Gateway event containing the user GUID.
 */
export const getFlextimeHandler: APIGatewayProxyHandler = async (event) => {
  const severaUserId = event.pathParameters?.severaUserId;

  try {
    const api = CreateSeveraApiService();

    if (!severaUserId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "SeveraUserId is required" }),
      };
    }

    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() - 1);
    const eventDateYesterday = eventDate.toISOString().split("T")[0];

    const flexTimeBySeveraId = await api.getFlextimeBySeveraUserId(severaUserId, eventDateYesterday);

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