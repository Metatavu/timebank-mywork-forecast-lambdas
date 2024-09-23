import type { APIGatewayProxyHandler } from "aws-lambda";
import type QuestionnaireModel from "src/database/models/questionnaire";
import { questionnaireService } from "src/database/services";
import { middyfy } from "src/libs/lambda";

/**
 * Labmda for listing all questions from DynamoDB.
 */

const listQuestionsHandler: APIGatewayProxyHandler = async () => {
  try {
    const allQuestionaires: QuestionnaireModel[] =
      await questionnaireService.listQuestionnaires();

    const mappedQuestionaires = allQuestionaires.map((questionaire) => {
      return {
        id: questionaire.id,
        title: questionaire.title,
        description: questionaire.description,
        options: questionaire.options,
        tags: questionaire.tags,
        passedUsers: questionaire.passedUsers,
        passScore: questionaire.passScore,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(mappedQuestionaires),
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

export default middyfy(listQuestionsHandler);
