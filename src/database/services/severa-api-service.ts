import fetch from "node-fetch";
import type Flextime from "../models/severa";
import type getUsers from "../models/severa";

/**
 * Interface for a SeveraApiService.
 */
export interface SeveraApiService {
  getFlextimeBySeveraUserId: (severaUserId: string, eventDate: string) => Promise<Flextime>;
  getUsers: () => Promise<getUsers>;
}


/**
 * Creates SeveraApiService
 */
export const CreateSeveraApiService = (): SeveraApiService => {
  const baseUrl: string = process.env.SEVERA_DEMO_BASE_URL;

  return {
    /**
     * Gets flextime by userGUID and eventDate
     */
    getFlextimeBySeveraUserId: async (severaUserId: string, eventDate: string) => {
      const url: string = `${baseUrl}/v1/users/${severaUserId}/flextime?eventdate=${eventDate}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getSeveraAccessToken()}`,
          "Client_Id": process.env.SEVERA_DEMO_CLIENT_ID,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch flextime: ${response.status} - ${response.statusText}`,
        );
      }
      const data = await response.json();
      console.log("Flextime data:", data); // Log the response data
      return data;
      // return response.json();
    },

    /**
     * Gets users from Severa
     */
    getUsers: async () => {
      const url: string = `${baseUrl}/v1/users`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getSeveraAccessToken()}`,
          "Client_Id": process.env.SEVERA_DEMO_CLIENT_ID,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch users: ${response.status} - ${response.statusText}`,
        );
      }
      const data = await response.json();
      console.log("Users data:", data); // Log the response data
      return data;
      // return response.json();
  },
  }
};

/**
 * Gets Severa access token
 *
 * @returns Access token as string
 */
const getSeveraAccessToken = async (): Promise<string> => {
  
  // if (process.env.IS_OFFLINE) {
  //   return "test-token";
  // }
  
  const url: string = `${process.env.SEVERA_DEMO_BASE_URL}/v1/token`;
  const client_Id: string = process.env.SEVERA_DEMO_CLIENT_ID;
  const client_Secret: string = process.env.SEVERA_DEMO_CLIENT_SECRET;

  const requestBody = {
    client_id: client_Id,
    client_secret: client_Secret,
    scope: "users:read",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get Severa access token: ${response.status} - ${response.statusText}`,
      );
    }
    const data = await response.json();

    return data.access_token;
  } catch (error) {
    throw new Error(`Failed to get Severa access token: ${error.message}`);
  }
};