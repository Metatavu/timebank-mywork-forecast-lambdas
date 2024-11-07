import {middyfy} from "src/libs/lambda";
import {vacationRequestService} from "src/database/services";
import {v4 as uuidv4} from "uuid";
import type {ValidatedEventAPIGatewayProxyEvent} from "src/libs/api-gateway";
import type vacationRequestSchema from "src/schema/vacationRequest";

/**
 * Handler for creating a new vacation request entry in DynamoDB.
 *
 * @param event - API Gateway event containing the request body.
 * @returns Response object with status code
 */
export const createVacationRequestHandler: ValidatedEventAPIGatewayProxyEvent<typeof vacationRequestSchema> = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is required." })
    };
  }

  const { personId, draft, startDate, endDate, days, type, status, message, createdBy, createdAt, updatedAt} = event.body;

  if (!personId || !startDate || !endDate || !days || !type || !status || !message || !createdBy || !createdAt || !updatedAt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body. Some data is missing." })
    };
  }

  const newVacationRequestId = uuidv4();

  try {
    const createdVacationRequest = await vacationRequestService.createVacationRequest({
      id: newVacationRequestId,
      personId: personId,
      draft: draft,
      startDate: startDate,
      endDate: endDate,
      days: days,
      type: type,
      status: status,
      message: message,
      createdBy: createdBy,
      createdAt: createdAt,
      updatedAt: updatedAt
    });

    return {
      statusCode: 201,
      body: JSON.stringify(createdVacationRequest)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Failed to create vacation request entry ${error}`
    }
  }
};

export const main = middyfy(createVacationRequestHandler);
