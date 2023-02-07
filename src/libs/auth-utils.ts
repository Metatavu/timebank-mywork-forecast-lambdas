import moment from "moment";
import { AccessToken } from "src/types";

// TODO: this must be implemented before deployment
// Use keycloak js
// All moment uses should be using luxon
/**
 * Returns true if token is valid, false otherwise
 *
 * @param token Access token
 */
export const isTokenValid = (token: AccessToken) => {
  if (!token) {
    return false;
  }

  const expiresAt = moment(token.created).add(token.expires_in, "milliseconds");
  return expiresAt.isAfter(moment());
}