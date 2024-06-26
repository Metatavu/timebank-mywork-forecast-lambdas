import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { middyfy } from 'src/libs/lambda';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

/**
 * Handler for retrieving a software entry from DynamoDB.
 * @param event - API Gateway event containing the path parameters.
 * @returns Response object with status code and body.
 */
export const findSoftwareHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid path parameter: id' }),
    };
  }

  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found' }),
      };
    }
  } catch (error) {
    console.error('DynamoDB error finding item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve item' }),
    };
  }
};

export const main = middyfy(findSoftwareHandler);
