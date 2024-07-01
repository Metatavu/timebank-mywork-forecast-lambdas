import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/apis/software-service";
import { middyfy } from "src/libs/lambda";
import { SoftwareModel } from "src/apis/schemas/software-registry/software";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler to update a software item in the DynamoDB table.
 * 
 * @param event - API Gateway event containing the request body and path parameters
 * @returns Response object with status code and body
 */
export const updateSoftwareHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters || {};
  const data: SoftwareModel = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing path parameter: id' }),
    };
  }

  try {
    const existingSoftware = await softwareService.findSoftware(id);
    if (!existingSoftware) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Software not found' }),
      };
    }

    const updatedSoftware = await softwareService.updateSoftware(id, data);

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
