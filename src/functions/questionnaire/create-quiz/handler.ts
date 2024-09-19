import QuestionnaireService from "src/database/services/quiz-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import type { QuestionnaireModel } from "src/database/schemas/questionnaire/questionnaire";
import type { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";
import { questionnaireService } from "src/database/services";

/**
 * Handler for creating a new questionnaire entry in DynamoDB.
 *
 * @param event - API Gateway event containing the request body.
 * @returns Response object with status code and body.
 */
export const createQuizHandler: ValidatedEventAPIGatewayProxyEvent<QuestionnaireModel> = async (event) => {
  const { body } = event;
  const {title,
    description,
    options,
    tags,
    passedUsers,
    passScore
  } = body;
  
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is required." })
      };
    }

    if (!data.id || !data.title || !data.description || !data.options || !data.tags || !data.passedUsers || !data.passScore) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Some required data is missing !" })
      };
    }

    const createdQuestionnaire = await questionnaireService.createQuestionnaire({
      id: newQuestionnaireid,
      title: title,
      description: newQuestionnaire.description,
      options: newQuestionnaire.options,
      tags: newQuestionnaire.tags,
      passedUsers: newQuestionnaire.passedUsers,
      passScore: newQuestionnaire
    });




    return {
      statusCode: 201,
      body: JSON.stringify(createdQuestionnaire)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create questionnaire entry.",
        details: error.message
      })
    };
  }
};

export const main = middyfy(createQuizHandler);
