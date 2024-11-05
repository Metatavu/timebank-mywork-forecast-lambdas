import { ChatPostMessageResponse } from "@slack/web-api";
import { ValidatedAPIGatewayProxyEvent } from "src/libs/api-gateway";
import schema from "src/types/meta-assistant/index";

/**
 * Interface for Notification Message Result
 */
export interface NotificationMessageResult {
  message: string;
  response: ChatPostMessageResponse;
};

/**
 * Type for NotificationHandlerResponse
 */
export type NotificationHandlerResponse = {
  message: string,
  data?: NotificationMessageResult[],
  event?: ValidatedAPIGatewayProxyEvent<typeof schema>,
};

/**
 * Interface for Notification Message Handler
 */
export interface ParsedBody {
  action: string,
  cardName: string,
  cardId: string,
  createdBy: string,
  cardList: string,
  cardBoard: string,
  assigned: string
};