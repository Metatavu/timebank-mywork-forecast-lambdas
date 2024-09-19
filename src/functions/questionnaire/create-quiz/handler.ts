import QuestionnaireService from "src/database/services/quiz-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import type { QuestionnaireModel } from "src/database/schemas/questionnaire/questionnaire";
import type { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";
import { questionnaireService } from "src/database/services";
import { v4 as uuid } from "uuid";

/**
 * Handler for creating a new questionnaire entry in DynamoDB.
 *
 * @param event - API Gateway event containing the request body.
 * @returns Response object with status code and body.
 */
export const createQuizHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { body } = event;
  const {
    title,
    description,
    options,
    tags,
    passedUsers,
    passScore
  } = body;

  const newQuestionnaireId = uuid();
  let questionnaireResponse: QuestionnaireModel | undefined = undefined;

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is required." })
      };
    }

    if (!title || !description || !options || !tags || !passedUsers || !passScore) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Some required data is missing !" })
      };
    }

    const createdQuestionnaire = await questionnaireService.createQuestionnaire({
      id: newQuestionnaireId,
      title: title,
      description: description,
      options: options,
      tags: tags,
      passedUsers: passedUsers,
      passScore: passScore
    });

    questionnaireResponse = createdQuestionnaire;

    return {
      statusCode: 201,
      body: JSON.stringify(questionnaireResponse)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Failed to create questionnaire entry ${error}`
    }
  }
};

export const main = middyfy(createQuizHandler);
