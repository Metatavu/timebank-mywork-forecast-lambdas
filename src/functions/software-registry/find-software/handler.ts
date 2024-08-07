import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/apis/software-service";
import { middyfy } from "src/libs/lambda";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for retrieving a software entry from DynamoDB.
 * 
 * @param event - API Gateway event containing the path parameters.
 * @returns Response object with status code and body.
 */
export const findSoftwareHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid path parameter: id' }),
    };
  }

  try {
    const software = await softwareService.findSoftware(id);

    if (software) {
      return {
        statusCode: 200,
        body: JSON.stringify(software),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Software not found' }),
      };
    }
  } catch (error) {
    console.error('DynamoDB error finding software:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve software.', details: error.message }),
    };
  }
};

export const main = middyfy(findSoftwareHandler);
