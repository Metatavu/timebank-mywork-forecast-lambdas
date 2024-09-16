import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/database/services/software-service";
import { middyfy } from "src/libs/lambda";
import { SoftwareModel, Status } from "src/database/schemas/software-registry/software";
import { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for creating a new software entry in DynamoDB.
 * 
 * @param event - API Gateway event containing the request body.
 * @returns Response object with status code and body.
 */
export const createSoftwareHandler: ValidatedEventAPIGatewayProxyEvent<SoftwareModel> = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required.' }),
      };
    }

    let data: SoftwareModel;
    if (typeof event.body === 'string') {
      data = JSON.parse(event.body);
    } else {
      data = event.body as SoftwareModel;
    }

    if (!data.name || !data.url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and URL are required fields.' }),
      };
    }

    const loggedUserId = event.requestContext.authorizer?.claims?.sub;
    
    if (!loggedUserId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'User is not authenticated.' }),
      };
    }

    const newSoftware: SoftwareModel = {
      name: data.name,
      url: data.url,
      image: data.image,
      description: data.description,
      review: data.review,
      recommend: data.recommend,
      tags: data.tags,
      users: data.users,
      createdBy: loggedUserId,
      lastUpdatedBy: loggedUserId,
    };

    const createdSoftware = await softwareService.createSoftware(newSoftware);

    return {
      statusCode: 201,
      body: JSON.stringify(createdSoftware),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create software entry.', details: error.message }),
    };
  }
};

export const main = middyfy(createSoftwareHandler);
