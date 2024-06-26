import { APIGatewayProxyHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import SoftwareService from 'src/apis/software-service';
import { middyfy } from 'src/libs/lambda';

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for listing all software entries from DynamoDB.
 * @returns Response object with status code and body.
 */
export const listSoftwareHandler: APIGatewayProxyHandler = async () => {
  try {
    const items = await softwareService.listSoftware();
    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve items' }),
    };
  }
};

export const main = middyfy(listSoftwareHandler);
