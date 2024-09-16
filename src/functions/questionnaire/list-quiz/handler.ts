import QuestionnaireService from "src/database/services/quiz-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";

/**
 * Handler for listing all questionnaire entries from DynamoDB.
 * 
 * @returns Response object with status code and body.
 */
const listQuizHandler: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  try {
    const dynamoDb = new DocumentClient();
    const questionnaireService = new QuestionnaireService(dynamoDb);
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
