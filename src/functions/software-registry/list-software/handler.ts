import { APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SoftwareService from "src/database/services/software-service";
import { middyfy } from "src/libs/lambda";

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for listing all software entries from DynamoDB.
 * 
 * @returns Response object with status code and body.
 */
export const listSoftwareHandler: APIGatewayProxyHandler = async () => {
  try {
    const softwareList = await softwareService.listSoftware();
    return {
      statusCode: 200,
      body: JSON.stringify(softwareList),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve software list.', details: error.message }),
    };
  }
};

export const main = middyfy(listSoftwareHandler);
