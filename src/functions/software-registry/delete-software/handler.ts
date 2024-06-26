import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { middyfy } from 'src/libs/lambda';
import SoftwareService from 'src/apis/software-service';

const dynamoDb = new DocumentClient();
const softwareService = new SoftwareService(dynamoDb);

/**
 * Handler for deleting a software entry in DynamoDB.
 * @returns Response object with status code and body.
 */
export const deleteSoftwareHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Id is required.' }),
    };
  }

  try {
    const existingSoftware = await softwareService.findSoftware(id);
    if (!existingSoftware) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found.' }),
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
      body: JSON.stringify({ message: 'Could not delete item', error: error.message }),
    };
  }
};

export const main = middyfy(deleteSoftwareHandler);
