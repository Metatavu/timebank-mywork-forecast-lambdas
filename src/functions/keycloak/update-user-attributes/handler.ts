import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { CreateKeycloakApiService } from "src/database/services/keycloak-api-service";
import { middyfy } from "src/libs/lambda";
import { CreateSeveraApiService } from "src/services/severa-api-service";


/**
 * Lambda handler to update a user's attributes
 * 
 * @param event API Gateway event 
 * @returns Response message as JSON string
 */
const updateUserAttributeHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
  ) => { 
  try {
  if (!event.body) {
    throw new Error("Request body is missing.");
  }

  const body = JSON.parse(JSON.stringify(event.body));
  const { id, attribute } = body;

  const allowedKeys = ["isSeveraOptIn"]

  if (!id || !attribute || typeof attribute !== "object") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing or invalid parameters: 'id' or 'attribute'." }),
    };
  }

  const keys = Object.keys(attribute);
  if (!keys.every(key => allowedKeys.includes(key))) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Attributes contain invalid keys." }),
    };
  }

  const api = CreateKeycloakApiService();
 /*  const severaApi = CreateSeveraApiService() */

 /*  let severaUser: { email: string, guid: string } | null = null

  if (process.env.NODE_ENV === "development") {
    console.log("Current NODE_ENV:", process.env.NODE_ENV);
    severaUser = { email: "test-user@example.com", guid: process.env.SEVERA_TEST_USER_GUID };
    console.log("Using test user for development environment:", severaUser);
  } else {
    console.log("Looking up Severa user by Keycloak ID::", id);
    severaUser = await severaApi.getUserByEmail(id);
    console.log("Found user from Severa:", severaUser);
  }

  if (!severaUser || !severaUser.guid) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Severa user not found." }),
    };
  }
 */
  if (!attribute.isActive) {
    attribute.isActive = ["Active"];
  }

  await api.updateUserAttribute(id, attribute);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "User attribute updated successfully." }),
  };
} catch (error) {
  return {
    statusCode: 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: error.message, stack: error.stack }),
  };
}
  
};

export const main = middyfy(updateUserAttributeHandler);
