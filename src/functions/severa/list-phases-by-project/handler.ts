import type { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from "src/libs/lambda";
import type PhaseModel from "@database/models/phase";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";

/**
 * Handler for getting Phases by project from Severa REST API.
 *
 * @param event - API Gateway event containing the user GUID.
 */
export const getPhasesHandler: APIGatewayProxyHandler = async (event) => {
  const severaProjectId = event.pathParameters?.severaProjectId;
  try {
    const api = CreateSeveraApiService();
    if (!severaProjectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Project Id is required" }),
      };
    }

    const response: PhaseModel[] = await api.getPhasesBySeveraProjectId(severaProjectId);
    const phasesBySeveraProjectId = JSON.parse(JSON.stringify(response))

    return {
      statusCode: 200,
      body: phasesBySeveraProjectId,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getPhasesHandler);