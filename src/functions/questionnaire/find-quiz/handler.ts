import QuestionnaireService from "src/apis/quiz-api-service";
import { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";
// import { CreateKeycloakApiService, type KeycloakApiService } from "src/apis/keycloak-api-service";
import { middyfy } from "src/libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

/**
 * Lambda for finding quiz
 *
 * @param event event
 * @returns quiz information as string
 */

const findQuizHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { pathParameters } = event;

  try {
    // Ensure pathParameters and id are present before calling findQuestionnaire
    if (!pathParameters || !pathParameters.id) {
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

    // Create an instance of DocumentClient
    const documentClient = new DocumentClient();

    // Create an instance of QuestionnaireService
    const questionnaireService = new QuestionnaireService(documentClient);

    // Call the findQuestionnaire method
    const quizById = await questionnaireService.findQuestionnaire(
      pathParameters.id,
    );

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
