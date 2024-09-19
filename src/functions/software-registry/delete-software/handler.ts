import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/database/services/software-service";
import { getUserIdFromToken } from "src/libs/auth-utils";
import { middyfy } from "src/libs/lambda";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for deleting a software entry in DynamoDB.
 * 
 * @returns Response object with status code and body.
 */
export const deleteSoftwareHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log('Received event:', JSON.stringify(event));

  const { id } = event.pathParameters || {};
  console.log('Path parameter (id):', id);

  if (!id) {
    console.log('Missing ID in path parameters.');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Id is required.' }),
    };
  }

  let loggedUserId = getUserIdFromToken(event);
  const userRoles = event.requestContext.authorizer?.claims?.roles || [];
  console.log('User roles:', userRoles);

  const isAdmin = userRoles.includes('admin');

  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'User does not have permission to delete software.' }),
    };
  }

  try {
    console.log('Looking up existing software with id:', id);
    const existingSoftware = await softwareService.findSoftware(id);

    if (!existingSoftware) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Software not found.' }),
      };
    }

    await softwareService.deleteSoftware(id);

    return {
      statusCode: 204,
      body: null,
    };
  } catch (error) {
    console.error("Error deleting software with id: ${id}", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete software.', details: error.message }),
    };
  }
};

export const main = middyfy(deleteSoftwareHandler);
