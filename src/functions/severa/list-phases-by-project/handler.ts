import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service-TEMP";
import { middyfy } from "src/libs/lambda";
import PhaseModel from "@database/models/phase";
import phase from "@database/models/phase";

/**
 * Handler for getting Phases by project from Severa REST API.
 *
 * @param event - API Gateway event containing the user GUID.
 */
export const getPhasesBySeveraProjectGuidHandler: APIGatewayProxyHandler = async (event) => {
  const severaProjectGuid = event.pathParameters?.severaProjectGuid;
  try {
    const api = CreateSeveraApiService();
    if (!severaProjectGuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Project Guid is required" }),
      };
    }

    const response: PhaseModel[] = await api.getPhasesBySeveraProjectGuid(severaProjectGuid);
    const phasesBySeveraProjectGuid = JSON.parse(JSON.stringify(response))

    return {
      statusCode: 200,
      body: phasesBySeveraProjectGuid,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getPhasesBySeveraProjectGuidHandler);