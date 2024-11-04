import { middyfy } from "@libs/lambda";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateKeycloakApiService } from "src/database/services/keycloak-api-service";

/**
 * Lambda for listing users
 */
const listUsersHandler: APIGatewayProxyHandler = async () => {
  try {
    const api = CreateKeycloakApiService();

    const users = await api.getUsers();

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error when listing users" }),
    };
  }
};

export const main = middyfy(listUsersHandler);
