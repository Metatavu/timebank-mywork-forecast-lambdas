import fetch from "node-fetch";
import type { KeycloakProfile } from "keycloak-js/lib/keycloak";

/**
 * Custom Interface for a user in keycloak functions with severaUserId added.
 */
export interface CustomKeycloakProfile extends KeycloakProfile {
  severaUserId: string;
}
/**
 * Interface for a KeycloakApiService.
 */
export interface KeycloakApiService {
  getUsers: () => Promise<CustomKeycloakProfile[]>;
  findUser: (id: string) => Promise<CustomKeycloakProfile>;
}
/**
 * Creates KeycloakApiService
 */
export const CreateKeycloakApiService = (): KeycloakApiService => {
  const baseUrl: string = process.env.KEYCLOAK_BASE_URL;
  const realm: string = process.env.KEYCLOAK_REALM;

  return {
    /**
     * Gets all users from keycloak
     *
     * @returns List of users
     */
    getUsers: async (): Promise<CustomKeycloakProfile[]> => {
      const response = await fetch(`${baseUrl}/admin/realms/${realm}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch users: ${response.status} - ${response.statusText}`,
        );
      }

      const users: KeycloakProfile[] = await response.json();
      return users.map((user) => ({
        ...user,
        severaUserId: (user as CustomKeycloakProfile).severaUserId ?? undefined,
      })) as CustomKeycloakProfile[];
    },

    /**
     * Find user from keycloak
     *
     * @param id string
     * @returns user by Id
     */
    findUser: async (id: string): Promise<CustomKeycloakProfile> => {
      const response = await fetch(
        `${baseUrl}/admin/realms/${realm}/users/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to find user with id: ${id}`);
      }

      const user: KeycloakProfile = await response.json();
      return {
        ...user,
        severaUserId: (user as CustomKeycloakProfile).severaUserId ?? undefined,
      } as CustomKeycloakProfile;
    },
  };
};

/**
 * Requests an access token from keycloak API
 *
 * @returns access token as string
 */
const getAccessToken = async (): Promise<string> => {
  const realm: string = process.env.KEYCLOAK_REALM;
  const url: string = `${process.env.KEYCLOAK_BASE_URL}/realms/${realm}/protocol/openid-connect/token`;

  const requestBody = new URLSearchParams({
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    client_secret: process.env.KEYCLOAK_ADMIN_SECRET,
    grant_type: "client_credentials",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody.toString(),
    });
    const jsonResponse = await response.json();

    return jsonResponse.access_token;
  } catch (error) {
    throw new Error(error);
  }
};
