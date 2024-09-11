import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { CreateKeycloakApiService, type KeycloakApiService } from "src/apis/keycloak-api-service";
import { middyfy } from "src/libs/lambda";

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
 * Gets user from keycloak
 *
 * @param api
 * @param id
 * @returns user information by Id
 */
const findUser = async (api: KeycloakApiService, id: string): Promise<Response[]> => {
  return await api.findUser(id);
};

/** 
 * Lambda for finding user
 * 
 * @param event event
 * @returns user information as string
 */

const findUserHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  let apiResponse;

  try {
    const { queryStringParameters } = event;

    // Ensure queryStringParameters and id are present before making the API call
    if (!queryStringParameters || !queryStringParameters.id) {
      throw new Error("Missing or invalid path parameter: id");
    }
    const api = CreateKeycloakApiService();
    const userById = await findUser(api, queryStringParameters.id);

    apiResponse = {
      statusCode: 200,
      body: JSON.stringify(userById),
    };

  } catch (error) {
    apiResponse = {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return apiResponse;
};

export const main = middyfy(findUserHandler);
