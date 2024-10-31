import { ParsedBody } from "src/types/meta-assistant";

/**
 * Parses Trello webhook data into a structured object
 * 
 * @param body JSON data from a Trello webhook payload
 * @returns parsed Trello action details as a `ParsedBody` object
 */
export const parseCardDetails = (body: any) : ParsedBody => {
  const action = body.action?.type || "";
  const cardName = body.action?.data?.card?.name || "";
  const cardId = body.action?.data?.card?.id || "";
  const cardList = body.action?.data?.list?.name || "";
  const cardBoard = body.action?.data?.board?.name || ""
  const memberCreator = body.action?.memberCreator?.fullName || "";
  const memberAssigned = body.action?.data?.member?.name || "";
  
  return {
    action: action,
    cardName: cardName,
    cardId : cardId,
    createdBy: memberCreator,
    cardList: cardList,
    cardBoard: cardBoard,
    assigned: memberAssigned
  };
}