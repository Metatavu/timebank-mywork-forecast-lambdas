import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for getting users from Severa REST API.
 * 
 * @param event - API Gateway event.
 */
export const getUsersHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const api = CreateSeveraApiService();
    const users = await api.getUsers();

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getUsersHandler);