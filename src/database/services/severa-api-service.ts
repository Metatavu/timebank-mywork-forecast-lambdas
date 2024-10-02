import fetch from "node-fetch";

/**
 * Creates SeveraApiService
 */
export const CreateSeveraApiService = () => {
  const baseUrl: string = process.env.SEVERA_BASE_URL;

  return {
    /**
     * Gets flextime by userGUID
     */
    getFlexTimeByUser: async (
      userGuid: string,
      eventDate: string,
    ): Promise<any> => {
      const url: string = `${baseUrl}/v1/users/${userGuid}/flextime?date=${eventDate}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getSeveraAccessToken()}`,
          Client_Id: process.env.SEVERA_CLIENT_ID,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch flextime: ${response.status} - ${response.statusText}`,
        );
      }

      return response.json();
    },
  };
};

/**
 * Gets Severa access token
 *
 * @returns Access token as string
 */
const getSeveraAccessToken = async (): Promise<string> => {
  const url: string = `${process.env.SEVERA_BASE_URL}/v1/token`;
  const client_Id: string = process.env.SEVERA_CLIENT_ID;
  const client_Secret: string = process.env.SEVERA_CLIENT_SECRET;

  const requestBody = new URLSearchParams({
    client_id: client_Id,
    client_secret: client_Secret,
    scope: "customers:read",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get access token: ${response.status} - ${response.statusText}`,
      );
    }
    const data = await response.json();

    return data.access_token;
  } catch (error) {
    throw new Error(`Failed to get access token: ${error.message}`);
  }
};