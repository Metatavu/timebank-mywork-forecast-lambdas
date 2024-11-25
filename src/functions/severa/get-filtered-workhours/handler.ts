import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";
import { FilterUtilities } from "src/libs/filter-utils";
import type WorkHours from "src/types/severa/workHour/workHour";

/**
 * Handler for getting work hours from Severa REST API.
 *
 * @param event - API Gateway event containing the userId, projectId, and phaseId.
 */
export const getWorkHoursHandler: APIGatewayProxyHandler = async (event) => {
  const { severaUserId, severaProjectId, severaPhaseId } = event.pathParameters || {};
  const { startDate, endDate } = event.queryStringParameters || {};

  try {
    const api = CreateSeveraApiService();

    let url: string;

    if (severaProjectId) {
      url = `projects/${severaProjectId}/workhours`; 
    } else if (severaUserId) {
      url = `users/${severaUserId}/workhours`;
    } else {
      url = "workhours";
    }

    console.log(`Getting work hours from Severa API with URL: ${url}`);

    const response = await api.getWorkHoursBySeveraId(url, startDate, endDate);

    const mappedWorkHours  = response.map((workHours)   => ({
      severaWorkHoursId: workHours.guid ,
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

    const filteredWorkHours = mappedWorkHours.filter((workHours) => {
      if (severaProjectId && severaUserId) {
        const filteredWorkHoursUserProject = FilterUtilities.filterByUserSevera(workHours.user?.severaUserId, severaUserId);

        if (!filteredWorkHoursUserProject) {
          return false;
        }
      }
    
      if (severaPhaseId) {
        const filteredWorkHoursPhase = FilterUtilities.filterByPhaseSevera(workHours.phase?.severaPhaseId, severaPhaseId);

        if (!filteredWorkHoursPhase) {
          return false;
        }
      }
      return true;
    });

    console.log(JSON.parse(JSON.stringify(filteredWorkHours)));

    return {
      statusCode: 200,
      body: JSON.stringify(filteredWorkHours),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getWorkHoursHandler);
