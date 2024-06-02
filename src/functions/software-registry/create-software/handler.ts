import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { middyfy } from 'src/libs/lambda';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

export const createSoftwareHandler: APIGatewayProxyHandler = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
      TableName: tableName,
      Item: {
          id: uuidv4(),
          name: data.name,
          description: data.description,
          url: data.url,
          image: data.image,
          status: 'PENDING',
          createdBy: data.createdBy,
          createdAt: new Date().toISOString(),
          lastUpdatedBy: data.createdBy,
          lastUpdatedAt: new Date().toISOString(),
      },
  };

  try {
      await dynamoDb.put(params).promise();
      return {
          statusCode: 201,
          body: JSON.stringify(params.Item),
      };
  } catch (error) {
      return {
          statusCode: 500,
          body: JSON.stringify(error),
      };
  }
};

export const main = middyfy(createSoftwareHandler);
