import type { APIGatewayProxyHandler } from "aws-lambda";
import type QuestionnaireModel from "src/database/models/questionnaire";
import { questionnaireService } from "src/database/services";
import { middyfy } from "src/libs/lambda";

/**
 * Labmda for listing all questions from DynamoDB.
 */
const listQuestionnaireHandler: APIGatewayProxyHandler = async () => {
  try {
    const allQuestionnaires: QuestionnaireModel[] =
      await questionnaireService.listQuestionnaires();

    return {
      statusCode: 200,
      body: JSON.stringify(allQuestionaires),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve questionnaires.",
        details: error.message,
      }),
    };
  }
};

export const main = middyfy(listQuestionnaireHandler);
