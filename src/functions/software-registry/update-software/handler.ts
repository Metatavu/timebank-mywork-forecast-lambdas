import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { middyfy } from 'src/libs/lambda';
import { SoftwareModel } from 'src/apis/schemas/software-registry/software';
import SoftwareService from 'src/apis/software-service';

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
  const data: Partial<SoftwareModel> = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing path parameter: id' }),
    };
  }

  try {
    const updatedSoftware = await softwareService.updateSoftware(id, data);

    if (!updatedSoftware || !Object.keys(updatedSoftware).length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found or no attributes updated' }),
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
      body: JSON.stringify({ error: 'Could not update item' }),
    };
  }
};

export const main = middyfy(updateSoftwareHandler);
