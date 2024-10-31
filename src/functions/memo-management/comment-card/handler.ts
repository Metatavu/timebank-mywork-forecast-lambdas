import { APIGatewayProxyHandler } from "aws-lambda";
import { TrelloService } from "src/database/services/trello-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for creating a comment on a Trello card
 * 
 * @param event event
 * @returns JSON response
 */
const createCommentHandler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const { body } = event;

    if (!body?.cardId && !body?.comment) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }

    const trello = new TrelloService();
    const createdComment = await trello.createComment(body.comment, body.cardId);

    return {
      statusCode: 200,
      body: JSON.stringify(createdComment),
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create comment.", details: error.message }),
    };
  }
};

export const main = middyfy(createCommentHandler);