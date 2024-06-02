import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { middyfy } from 'src/libs/lambda';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

export const listSoftwareHandler: APIGatewayProxyHandler = async () => {
  const params = {
    TableName: tableName,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('DynamoDB error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve items' }),
    };
  }
};

export const main = middyfy(listSoftwareHandler);
