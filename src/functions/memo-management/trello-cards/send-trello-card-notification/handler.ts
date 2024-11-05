import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "src/libs/api-gateway";
import { middyfy } from "src/libs/lambda";
import { parseCardDetails } from "src/libs/parse-utils";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import { ParsedBody, NotificationHandlerResponse } from "src/types/trello-notification";

/**
 * Sends a Slack message to the notification handler
 *
 * @param parsedBody parsed data from Trello
 * @returns JSON response
 */
const sendNotification = async (parsedBody: ParsedBody): Promise<NotificationHandlerResponse> => {
  try {
    const response = await SlackUtilities.postNotificationToChannel(parsedBody);
    return {
      message: response
        ? "Successfully sent the SlackBot message"
        : "Error while posting Slack message"
    };
  } catch (error) {
    return {
      message: `Error while sending Slack message: ${error}`
    };
  }
};

/**
 * Lambda for sending notification messages to Slack
 *
 * @param event event
 * @returns JSON response
 */
const sendNotificationHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event;
  if (!body) return formatJSONResponse({ message: "No body provided" });

  try {
    const parsedBody: ParsedBody = parseCardDetails(body);

    if (new Set(["addMemberToCard", "createCard"]).has(parsedBody.action)) {
      const notificationResponse = await sendNotification(parsedBody);
      return formatJSONResponse({ ...notificationResponse, event });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const main = middyfy(sendNotificationHandler);