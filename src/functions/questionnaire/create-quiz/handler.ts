import QuestionnaireService from "src/database/services/quiz-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import type { QuestionnaireModel } from "src/database/schemas/questionnaire/questionnaire";
import type { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";

const dynamoDb = new DocumentClient();
const questionnaireService = new QuestionnaireService(dynamoDb);

/**
 * Handler for creating a new questionnaire entry in DynamoDB.
 *
 * @param event - API Gateway event containing the request body.
 * @returns Response object with status code and body.
 */
export const createQuizHandler: ValidatedEventAPIGatewayProxyEvent<QuestionnaireModel> = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is required." })
      };
    }

    let data: QuestionnaireModel;
    if (typeof event.body === "string") {
      data = JSON.parse(event.body);
    } else {
      data = event.body as QuestionnaireModel;
    }

    if (!data.id || !data.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Id and Title are required fields." })
      };
    }

    const newQuestionnaire: QuestionnaireModel = {
      id: data.id,
      title: data.title,
      description: data.description,
      options: data.options,
      tags: data.tags,
      passedUsers: data.passedUsers,
      passScore: data.passScore
    };

    const createdQuestionnaire = await questionnaireService.createQuestionnaire(newQuestionnaire);

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
