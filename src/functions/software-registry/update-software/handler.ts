import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/database/services/software-service";
import { middyfy } from "src/libs/lambda";
import { SoftwareModel } from "src/database/schemas/software-registry/software";
import { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler to update a software item in the DynamoDB table.
 * 
 * @param event - API Gateway event containing the request body and path parameters
 * @returns Response object with status code and body
 */
export const updateSoftwareHandler: ValidatedEventAPIGatewayProxyEvent<SoftwareModel> = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing path parameter: id' }),
      };
    }

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

    const loggedUserId = event.requestContext.authorizer?.claims?.sub;
    
    if (!loggedUserId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'User is not authenticated.' }),
      };
    }

    const existingSoftware = await softwareService.findSoftware(id);
    if (!existingSoftware) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Software not found' }),
      };
    }

    const updatedSoftwareData: SoftwareModel = {
      name: data.name,
      url: data.url,
      image: data.image,
      description: data.description,
      review: data.review,
      recommend: data.recommend,
      status: data.status,
      tags: data.tags,
      users: data.users,
      lastUpdatedBy: loggedUserId,
      createdBy: existingSoftware.createdBy
    };

    const updatedSoftware = await softwareService.updateSoftware(id, updatedSoftwareData);

    if (!updatedSoftware) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Software not found or no attributes updated' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updatedSoftware),
    };
  } catch (error) {
    console.error('DynamoDB update error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update software.', details: error.message }),
    };
  }
};

export const main = middyfy(updateSoftwareHandler);
