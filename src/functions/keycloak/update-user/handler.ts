import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { CreateKeycloakApiService } from "src/database/services/keycloak-api-service";
import { middyfy } from "src/libs/lambda";

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

    if (!id || !attribute || typeof attribute !== "object") {
      throw new Error("Missing or invalid body parameters: id, attributes.");
    }

    const api = CreateKeycloakApiService();

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
