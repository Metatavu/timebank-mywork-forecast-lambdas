import { APIGatewayProxyHandler } from "aws-lambda";
import { TrelloService } from "src/database/services/trello-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for card creation
 * 
 * @param event event
 * @returns JSON responce
 */
const createCardHandler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const { body } = event;

    if (!body?.title && !body?.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" })
      };
    } 
      
    const trello = new TrelloService();
    const newCard = await trello.createCard(body.title, body.description);

    return {
      statusCode: 200,
      body: JSON.stringify({
        cardId: newCard.shortLink,
        title: newCard.name,
        description: newCard.desc
      })
    };

  } catch (error) {
    console.error("Error creating card:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create card.', details: error.message }),
    };
  }
};

export const main = middyfy(createCardHandler);