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

    const mappedUsers = users.map((user) => {
      const responseUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        severaGuid: user.severaGuid,
      };
      return responseUser;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(mappedUsers),
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
