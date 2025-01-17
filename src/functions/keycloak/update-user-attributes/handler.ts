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
  const { email, attribute } = body;

  const allowedKeys = ["isSeveraOptIn"]

  if (!email || !attribute || typeof attribute !== "object") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing or invalid parameters: 'email' or 'attribute'." }),
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
  const severaApi = CreateSeveraApiService()

  const severaUser = await severaApi.getUserByEmail(email);

  if (!severaUser || !severaUser.guid) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Severa user not found." }),
    };
  }

  if (!attribute.isActive) {
    attribute.isActive = ["Active"];
  }

  await api.updateUserAttribute(email, attribute);

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
