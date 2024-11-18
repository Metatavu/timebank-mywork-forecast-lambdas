import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";
import type WorkHours from "@database/models/workHours";
import { FilterUtilities } from "src/libs/filter-utils";

/**
 * Handler for getting work hours from Severa REST API.
 *
 * @param event - API Gateway event containing the userId, projectId, and phaseId.
 */
export const getWorkHoursHandler: APIGatewayProxyHandler = async (event) => {
  const { severaUserId, severaProjectId, severaPhaseId } = event.pathParameters;
  const { startDate, endDate } = event.queryStringParameters || {};

  try {
    const api = CreateSeveraApiService();
    const response: WorkHours[] = await api.getWorkHoursBySeveraId(severaProjectId, severaUserId, severaPhaseId, startDate, endDate);

    const filteredWorkHours = response.filter((workHours:any) => {
      return (
        (!severaUserId || FilterUtilities.filterByUserSevera(workHours.user?.guid, severaUserId)) &&
        (!severaPhaseId || FilterUtilities.filterByPhaseSevera(workHours.phase?.guid, severaPhaseId)) &&
        (!startDate || FilterUtilities.filterByDateSevera(workHours.startDate, startDate)) &&
        (!endDate || FilterUtilities.filterByDateSevera(workHours.endDate, endDate))
      );
    });

    const mappedWorkHours = filteredWorkHours.map((workHours:any) => ({
      severaWorkHoursId: workHours.guid,
      user: {
        severaUserId: workHours.user?.guid,
        name: workHours.user?.name,
      },
      project: {
        severaProjectId: workHours.project?.guid,
        name: workHours.project?.name,
        isClosed: workHours.project?.isClosed,
      },
      phase: {
        severaPhaseId: workHours.phase?.guid,
        name: workHours.phase?.name,
      },
      description: workHours.description,
      eventDate: workHours.eventDate,
      quantity: workHours.quantity,
      startTime: workHours.startTime,
      endTime: workHours.endTime,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(mappedWorkHours),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getWorkHoursHandler);
