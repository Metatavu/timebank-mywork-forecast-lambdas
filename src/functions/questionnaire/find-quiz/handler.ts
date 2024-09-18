import QuestionnaireService from "src/database/services/quiz-api-service";
// import { CreateKeycloakApiService, type KeycloakApiService } from "src/apis/keycloak-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

const dynamoDb = new DocumentClient();
const questionnaireService = new QuestionnaireService(dynamoDb);

/**
 * Lambda for finding quiz entry from DynamoDB.
 *
 * @param event event
 * @returns quiz information as object
 */

const findQuizHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
) => {
  const { id } = event.pathParameters || {};

  try {
    if (!id) {
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing or invalid path parameter: id",
        }),
      };
    }

    const quizById = await questionnaireService.findQuestionnaire(id);

    if (!quizById) throw new Error("Quiz not found");

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: JSON.stringify(quizById),
    };
  } catch (error) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve quiz.",
        details: error.message,
      }),
    };
  }
};

export const main = middyfy(findQuizHandler);
