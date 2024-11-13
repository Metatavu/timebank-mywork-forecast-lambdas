import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";
import type WorkHours from "@database/models/workHours";
import { DateTime } from "luxon";
import { start } from "repl";


/**
 * Handler for getting work hours Severa REST API.
 *
 * @param event - API Gateway event containing the userId.
 */
export const getWorkHoursHandler: APIGatewayProxyHandler = async (event) => {

  const severaUserId = event.pathParameters?.severaUserId;
  const severaProjectId = event.pathParameters?.severaProjectId;
  const severaPhaseId = event.pathParameters?.severaPhaseId;
  const startDate = event.queryStringParameters?.startTime;
  const endDate = event.queryStringParameters?.endTime;

  console.log("event", event)

  // const startDateString = "2024-01-01";
  // const endDateString = "2024-12-31";

  // const startDate = DateTime.fromISO(startDateString).toISO()
  // const endDate = DateTime.fromISO(endDateString).toISO()

  // console.log("startDate", startDate)


  // const startDate = startDateString ? DateTime.fromISO(startDateString).toISO() : new Date().toISOString();
  // const endDate = endDateString ? DateTime.fromISO(endDateString).toISO() : new Date().toISOString();






  
  try {
    const api = CreateSeveraApiService();
    const response: WorkHours[] = await api.getWorkHoursBySeveraId(severaProjectId, severaUserId, severaPhaseId, startDate, endDate);

    const workHoursByUserId = JSON.parse(JSON.stringify(response))

    return {
      statusCode: 200,
      body: workHoursByUserId,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const main = middyfy(getWorkHoursHandler);