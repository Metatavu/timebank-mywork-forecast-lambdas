import moment from "moment";
import { AccessToken } from "src/types";

/**
 * Returns true if token is valid, false otherwise
 * 
 * @param token Access token 
 */
export const isTokenValid = (token: AccessToken) => {
  if (!token) {
    return false;
  }

  // TODO this expiration check is incorrect
  const expiresAt = moment(token.created).add(token.expires_in, "seconds");
  return expiresAt.isAfter(moment());
}