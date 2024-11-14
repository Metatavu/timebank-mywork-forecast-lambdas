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

  try {
    const api = CreateSeveraApiService();
    const response: WorkHours[] = await api.getWorkHoursBySeveraId(severaProjectId, severaUserId, severaPhaseId);

    // Define a reusable mapping function
    const mapWorkHours = (workHours: any) => ({
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
    });

    // Reusable filtering and mapping function
    const filterAndMapWorkHours = (response: any[], severaUserId?: string, severaPhaseId?: string) => {
      let filteredResponse = response;

      // Apply user filter if severaUserId is provided
      if (severaUserId) {
        console.log("Filtering by severaUserId:", severaUserId);
        filteredResponse = filteredResponse.filter(workHours =>
          FilterUtilities.filterByUserSevera(workHours.user?.guid, severaUserId)
        );
      }

      // Apply phase filter if severaPhaseId is provided
      if (severaPhaseId) {
        console.log("Filtering by severaPhaseId:", severaPhaseId);
        filteredResponse = filteredResponse.filter(workHours =>
          FilterUtilities.filterByPhaseSevera(workHours.phase?.guid, severaPhaseId)
        );
      }

      // Map the filtered response to the desired structure
      return filteredResponse.map(mapWorkHours);
    };

    // Call the filter and map function with the response data
    const result = filterAndMapWorkHours(response, severaUserId, severaPhaseId);

    console.log(JSON.parse(JSON.stringify(result)))

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getWorkHoursHandler);
