import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { middyfy } from "src/libs/lambda";

const 

export const findUsersHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid path parameter: id" }),
    };
  }

  try {
    const userById = await softwareService.getUser(id);

    if (software) {
      return {
        statusCode: 200,
        body: JSON.stringify(userById),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
  } catch (error) {
    console.error('DynamoDB error finding software:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve software.", details: error.message }),
    };
  }
};

export const main = middyfy(findUsersHandler);