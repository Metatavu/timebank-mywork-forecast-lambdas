import { middyfy } from "@libs/lambda";
import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import {
  CreateKeycloakApiService,
  type KeycloakApiService,
} from "src/database/services/keycloak-api-service";

/**
 * Response schema for lambda
 */
interface Response {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  severaGuid: string;
  forecastId: number;
}

/**
 * Lambda for listing users
 */
const listUsersHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const api = CreateKeycloakApiService();

    const users = await api.getUsers(event);

    const mappedUsers: Response[] = users.map((user) => {
      const responseUser: Response = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        severaGuid: user.severaGuid,
        forecastId: user.forecastId,
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
