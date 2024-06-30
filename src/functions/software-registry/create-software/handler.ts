import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/apis/software-service";
import { middyfy } from "src/libs/lambda";
import { SoftwareModel } from "src/apis/schemas/software-registry/software";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for creating a new software entry in DynamoDB.
 * 
 * @param event - API Gateway event containing the request body.
 * @returns Response object with status code and body.
 */
export const createSoftwareHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const data: SoftwareModel = JSON.parse(event.body);
    if (!data.name || !data.url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and URL are required fields.' }),
      };
    }
    const newSoftware = await softwareService.createSoftware(data);
    return {
      statusCode: 201,
      body: JSON.stringify(newSoftware),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create software entry.', details: error.message }),
    };
  }
};

export const main = middyfy(createSoftwareHandler);
