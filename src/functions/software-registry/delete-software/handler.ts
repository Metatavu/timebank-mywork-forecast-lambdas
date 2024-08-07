import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/apis/software-service";
import { middyfy } from "src/libs/lambda";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for deleting a software entry in DynamoDB.
 * 
 * @returns Response object with status code and body.
 */
export const deleteSoftwareHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Id is required.' }),
    };
  }

  const userRoles = event.requestContext.authorizer?.claims?.roles || [];
  const isAdmin = userRoles.includes('admin');

  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'User does not have permission to delete software.' }),
    };
  }

  try {
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete software.', details: error.message }),
    };
  }
};

export const main = middyfy(deleteSoftwareHandler);
