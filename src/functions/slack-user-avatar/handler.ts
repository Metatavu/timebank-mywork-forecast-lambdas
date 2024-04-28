import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import Auth from "src/meta-assistant/auth/auth-provider";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import TimeBankApiProvider from "src/meta-assistant/timebank/timebank-api";

/**
 * Response schema for lambda
 */
export interface Response {
  personId: number,
  image_original: string
}

/**
 * Lambda to receive user's slack avatar by email
 */
const getSlackUserAvatar: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  const { accessToken } = await Auth.getAccessToken();
  if (!accessToken) {
    throw new Error("Timebank authentication failed");
  }

  const timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);
  if (!timebankUsers) {
    throw new Error("No persons retrieved from Timebank");
  }

  const slackUsers = await SlackUtilities.getSlackUsers();
  const images: Response[] = [];

  for (const timebankUser of timebankUsers) {
    const image = slackUsers.find((user) => user.name === timebankUser.email.split("@")[0]);
    if (image) {
      images.push({personId: timebankUser.id, image_original: image.profile.image_original});
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(images)
  };
}

export const main = getSlackUserAvatar;