import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { middyfy } from 'src/libs/lambda';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

export const updateSoftwareHandler: APIGatewayProxyHandler = async (event) => {
    const data = JSON.parse(event.body);

    if (!data.name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing or invalid fields in request body' }),
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id,
        },
        UpdateExpression: 'set #name = :name, #description = :description, #url = :url, #image = :image, #status = :status, #lastUpdatedBy = :lastUpdatedBy, #lastUpdatedAt = :lastUpdatedAt',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#description': 'description',
            '#url': 'url',
            '#image': 'image',
            '#status': 'status',
            '#lastUpdatedBy': 'lastUpdatedBy',
            '#lastUpdatedAt': 'lastUpdatedAt',
        },
        ExpressionAttributeValues: {
            ':name': data.name,
            ':description': data.description,
            ':url': data.url,
            ':image': data.image,
            ':status': data.status,
            ':lastUpdatedBy': data.lastUpdatedBy,
            ':lastUpdatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
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
