import { middyfy } from "src/libs/lambda";

/**
 * Lambda for handling Trello webhook verification and events
 *
 * @param event - API Gateway Lambda Proxy Input Format
 * @returns JSON response
 */
const registerTrelloWebhook = async () => {
  return {
    status: 200,
  };
}

export const main = middyfy(registerTrelloWebhook);