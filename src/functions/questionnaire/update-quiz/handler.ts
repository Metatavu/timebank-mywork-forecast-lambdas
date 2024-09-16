import QuestionnaireService from "src/database/services/quiz-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";
import { QuestionnaireModel } from "src/database/schemas/questionnaire/questionnaire";

/**
 * Handler for updating a questionnaire entry in DynamoDB.
 * 
 * @param event - API Gateway event containing the questionnaire data to update.
 * @returns Response object with status code and body.
 */
const updateQuizHandler: ValidatedEventAPIGatewayProxyEvent<QuestionnaireModel> = async (event) => {
  try {
    const dynamoDb = new DocumentClient();
    const questionnaireService = new QuestionnaireService(dynamoDb);
    const updatedQuestionnaire = await questionnaireService.updateQuestionnaire(event.body as QuestionnaireModel);

    return {
    statusCode: 200,
    body: JSON.stringify(updatedQuestionnaire),
    };
  } catch (error) {
      return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update questionnaire.", details: error.message }),
      };
  }
};

export const main = middyfy(updateQuizHandler);