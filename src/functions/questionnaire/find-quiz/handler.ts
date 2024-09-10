import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
// import { CreateKeycloakApiService, type KeycloakApiService } from "src/apis/keycloak-api-service";
import { middyfy } from "src/libs/lambda";


/**
 * Response schema for lambda
 */
interface Response {
  id: number;
  title: string;
  description: string;
  questions: Question[]; // TODO: Make Question interface
  }

/**
 * Gets quiz from database
 *
 * @param api
 * @param id
 * @returns quiz information by Id
 */

// TODO: Add new API when available

const findQuiz = async (api: KeycloakApiService, id: string): Promise<Response[]> => {
  const quiz = await api.findQuiz(id);
  if (!quiz) {
    throw new Error("Cannot find quiz from Api");
}
  return quiz;
};

/** 
 * Lambda for finding quiz
 * 
 * @param event event
 * @returns quiz information as string
 */

const findQuizHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const api = CreateKeycloakApiService();
  const { queryStringParameters } = event;

  // Ensure queryStringParameters and id are present
  if (!queryStringParameters || !queryStringParameters.id) {
    return {
      headers:{
        "Content-Type": "application/json"
      },
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid path parameter: id" })
    };
  }

  try {
    const quizById = await findQuiz(api, queryStringParameters.id);
        if (!quizById) {
      return {
        headers:{
          "Content-Type": "application/json"
        },
        statusCode: 404,
        body: JSON.stringify({ error: "Quiz not found" })
    };
    }
    return {
      headers:{
        "Content-Type": "application/json"
      },
      statusCode: 200,
      body: JSON.stringify(quizById)
    };
  } catch (error) {
    console.log("query string parameters:", queryStringParameters);
    return {
      headers:{
        "Content-Type": "application/json"
      },
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve quiz.", details: error.message })
    };
  }
};

export const main = middyfy(findQuizHandler);