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
  const user = await api.findUser(id);
  if (!user) {
    throw new Error('Cannot find user from Api');
}
  return user;
};

/** 
 * Lambda for finding user
 * 
 * @param _event event
 * @returns user information as string
 */

const findUserHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const api = CreateKeycloakApiService();
  const { queryStringParameters } = event;

  // Ensure queryStringParameters and id are present
  if (!queryStringParameters || !queryStringParameters.id) {
    return {
      headers:{
        "Content-Type": "application/json"
      },
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid path parameter: id" })
    };
  }

  try {
    const userById = await findUser(api, queryStringParameters.id);
        if (!userById) {
      return {
        headers:{
          "Content-Type": "application/json"
        },
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" })
    };
    }
    return {
      headers:{
        "Content-Type": "application/json"
      },
      statusCode: 200,
      body: JSON.stringify(userById)
    };
  } catch (error) {
    console.log("query string parameters:", queryStringParameters);
    return {
      headers:{
        "Content-Type": "application/json"
      },
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve user.", details: error.message })
    };
  }
};

export const main = middyfy(findUserHandler);
