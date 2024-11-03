import { APIGatewayProxyHandler } from "aws-lambda";
import { TrelloService } from "src/database/services/trello-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for listing cards on a Trello list
 * 
 * @returns JSON responce
 */
const getCardsOnListHandler: APIGatewayProxyHandler = async () => {
  try {
    const trello = new TrelloService();
    const cards = await trello.getCardsOnList();
    const cardsComments = await trello.getCardsComments(cards);

    const cardsParsed = cards.map((card, index) => {
      const cardComments = cardsComments[index];
      return {
        cardId: card.shortLink,
        title: card.name,
        description: card.desc,
        assignedPersons: card.idMembers,
        comments: cardComments, 
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(cardsParsed),
    };
  } catch (error) {
    console.error("Error fetching cards:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch cards.", details: error.message }),
    };
  }
};

export const main = middyfy(getCardsOnListHandler);