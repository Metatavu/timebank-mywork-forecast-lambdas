import QuestionnaireService from "src/apis/quiz-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";

const dynamoDb = new DocumentClient();
const questionnaireService = new QuestionnaireService(dynamoDb);

/**
 * Handler for listing all questionnaire entries from DynamoDB.
 * 
 * @returns Response object with status code and body.
 */
export const listQuizHandler: APIGatewayProxyHandler = async () => {
  try {
    const questionnaireList = await questionnaireService.listQuestionnaires();
    return {
      statusCode: 200,
      body: JSON.stringify(questionnaireList),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve questionnaire list.', details: error.message }),
    };
  }
};

export const main = middyfy(listQuizHandler);
