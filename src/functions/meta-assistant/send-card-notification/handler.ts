import { formatJSONResponse, NotificationHandlerResponse, ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";
import { middyfy } from "src/libs/lambda";
import { parseCardDetails } from "src/libs/parse-utils";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import { ParsedBody } from "src/types/meta-assistant";

/**
 * Sends a Slack message to the notification handler
 *
 * @param parsedBody parsed data from Trello
 * @returns JSON response
 */
const sendNotification = async (parsedBody: ParsedBody) : Promise<NotificationHandlerResponse> => {
  try {
    const response = await SlackUtilities.postNotificationToChannel(parsedBody);
      return {
        message: response
        ? "Everything went well sending the SlackBot message"
        : "Error while posting slack message"
      };
  } catch (error) {
    return {
      message: `Error while sending slack message: ${error}`
    };
  }
};

/**
 * Lambda for sending notification messages to Slack
 *
 * @param event event
 * @returns JSON response
 */
const sendNotificationHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event: any) => {
  const { body } = event;
  if (!body) return;

  const parsedBody = parseCardDetails(body);
  if (new Set(["addMemberToCard", "createCard"]).has(parsedBody.action)) {
    return (
      formatJSONResponse({
        ...await sendNotification(parsedBody),
        event: event
      })
    )
  }
}

export const main = middyfy(sendNotificationHandler);