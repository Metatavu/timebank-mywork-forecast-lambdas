import moment from "moment";
import Config from "src/app/config";
import { AccessToken } from "src/types";

/**
 * Returns true if token is valid, false otherwise
 * 
 * @param token Access token 
 */
// export const isTokenValid = (token: AccessToken) => {

  

//   if (!token) {
//     return false;
//   }

//   const expiresAt = moment(token.created).add(token.expires_in, "milliseconds");
//   return expiresAt.isAfter(moment());
// }

export const isTokenValid = async (authzHeader: string) => {
  const { baseUrl, realm } = Config.getKeycloakConfig();
    try {
      const request = await fetch(`${baseUrl}/realms/${realm}/protocol/openid-connect/userinfo`, {
        method: "GET",
        headers: {
          "Authorization": authzHeader
        }
      });
      console.log(request.status);
      if (request.status === 200) {
        return true;
      }

      return false;
    } catch (e) {
      console.error("Error during authorization", e);

      return false;
    }
  };