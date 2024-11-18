import type { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from "src/libs/lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";

/**
 * Handler for getting Phases by project from Severa REST API.
 *
 * @param event - API Gateway event containing the userId.
 */
export const getPhasesHandler: APIGatewayProxyHandler = async (event) => {
  const {severaProjectId} = event.pathParameters

  try {
    const api = CreateSeveraApiService();

    if (!severaProjectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Project Id is required" }),
      };
    }

    const response = await api.getPhasesBySeveraProjectId(severaProjectId);

    const phases =  response.map((item: any) => ({
      severaPhaseId: item.guid,
      name: item.name,
      isCompleted: item.isCompleted,
      workHoursEstimate: item.workHoursEstimate,
      startDate: item.startDate,
      deadLine: item.deadline,
      project: {
        severaProjectId: item.project.guid,
        name: item.project.name,
        isClosed: item.project.isClosed,
      },
    }));

    console.log(JSON.parse(JSON.stringify(phases)))

    return {
      statusCode: 200,
      body: JSON.stringify(phases),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getPhasesHandler);