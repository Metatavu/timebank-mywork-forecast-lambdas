import { APIGatewayProxyHandler } from "aws-lambda";
import { TrelloService } from "src/database/services/trello-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for card deleting
 * 
 * @param event event
 * @returns JSON responce
 */
const deleteCardHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }
    
    const trello = new TrelloService();
    const result = await trello.deleteCard(id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Card deleted successfully", result }),
    };
  } catch (error) {
    console.error("Error deleting card:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to delete card.", details: error.message }),
    };
  }
};

export const main = middyfy(deleteCardHandler);