import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * @param event
 * @returns users flextime
 */
const getFlexTimeHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
) => {
  try {
    const userGuid = event.pathParameters?.userGuid;
    const eventDate = event.queryStringParameters?.date;
    const api = CreateSeveraApiService();

    if (!userGuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Guid is required" }),
      };
    }

    const flexTimeByUser = await api.getFlexTimeByUser(userGuid, eventDate);

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

export const main = middyfy(getFlexTimeHandler);