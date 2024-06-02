import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { middyfy } from 'src/libs/lambda';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

export const deleteSoftwareHandler: APIGatewayProxyHandler = async (event) => {
    const { id } = event.pathParameters;

    const params = {
        TableName: tableName,
        Key: { id },
    };

    try {
        await dynamoDb.delete(params).promise();
        return {
            statusCode: 204,
            body: null,
        };
    } catch (error) {
        console.error('DynamoDB delete error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not delete item' }),
        };
    }
};

export const main = middyfy(deleteSoftwareHandler);