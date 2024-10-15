import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { CreateKeycloakApiService } from "src/database/services/keycloak-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Lambda for finding user
 *
 * @param event event
 * @returns user information as string
 */

const findUserHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
) => {
  try {
    const { queryStringParameters } = event;
    const api = CreateKeycloakApiService();

    if (!queryStringParameters || !queryStringParameters.id) {
      throw new Error("Missing or invalid path parameter: id");
    }

    const userById = await api.findUser(queryStringParameters.id);

    const filteredUser: User = {
      id: userById.id,
      firstName: userById.firstName,
      lastName: userById.lastName,
      email: userById.email,
      isActive: userById.isActive,
      severaGuid: userById.severaGuid,
      forecastId: userById.forecastId
    };

    return {
      statusCode: 200,
      body: JSON.stringify(filteredUser),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(findUserHandler);
