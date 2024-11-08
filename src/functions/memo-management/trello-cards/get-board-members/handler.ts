import { APIGatewayProxyHandler } from "aws-lambda";
import { TrelloService } from "src/database/services/trello-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for fetching email addresses of Trello board members
 * 
 * @returns JSON response
 */
const getBoardMembersHandler: APIGatewayProxyHandler = async () => {
  try {
    const trello = new TrelloService();
    const emails = await trello.getBoardMembers();

    return {
      statusCode: 200,
      body: JSON.stringify(emails),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch board members' emails.", details: error.message }),
    };
  }
};

export const main = middyfy(getBoardMembersHandler);