import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for getting flextime by user from Severa REST API.
 * 
 * @param event - API Gateway event containing the user GUID.
 */
export const getFlextimeHandler: APIGatewayProxyHandler = async (event) => {
  const severaGuid = event.pathParameters?.severaGuid;
  const eventDateParam = event.queryStringParameters?.eventDate;

  try {
    const api = CreateSeveraApiService();

    if (!severaGuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Guid is required" }),
      };
    }

    const eventDate = eventDateParam || new Date().toISOString();

    const flexTimeBySeveraGuid = await api.getFlextimeBySeveraGuid(severaGuid, eventDate);

    return {
      statusCode: 200,
      body: JSON.stringify(flexTimeBySeveraGuid),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getFlextimeHandler);