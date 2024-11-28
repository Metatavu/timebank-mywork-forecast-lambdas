import fetch from "node-fetch";
import type { Flextime, getWorkhours, SeveraUsers, WorkDays } from "../models/severa";
import { DateTime } from "luxon";

/**
 * Interface for a SeveraApiService.
 */
export interface SeveraApiService {
  getFlextimeBySeveraUserId: (severaUserId: string, eventDate: string) => Promise<Flextime>;
  getWorkhours: () => Promise<getWorkhours>;
  getWorkDays: (severaUserId: string) => Promise<WorkDays>;
  getUsers: () => Promise<SeveraUsers>;
  getResourceAllocations: () => Promise<SeveraUsers>;
  getProjectHours: (projectGuid: string) => Promise<getWorkhours>;
}


/**
 * Creates SeveraApiService
 */
export const CreateSeveraApiService = (): SeveraApiService => {
  const baseUrl: string = process.env.SEVERA_DEMO_BASE_URL;

  return {
    /**
     * Gets flextime by severaUserId
     */
    getFlextimeBySeveraUserId: async (severaUserId: string) => {

      const eventDateYesterday = DateTime.now().minus({ days: 1 }).toISODate();
      
      const url = `${baseUrl}/v1/users/${severaUserId}/flextime?eventdate=${eventDateYesterday}`;

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
     * 
     * Gets Workdays from Severa
     */

    getWorkDays: async (severaUserId: string) => {

      const eventDateYesterday = DateTime.now().minus({ days: 1 }).toISODate();
      const today = DateTime.now().toISODate();
      const url = `${baseUrl}/v1/users/${severaUserId}/workdays?startDate=2024-11-26&endDate=2024-11-26`

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
          `Failed to fetch workdays: ${response.status} - ${response.statusText}`,
        );
      }
      const data = await response.json();
      return data;
    },
    /**
     * 
     * Gets resourceallocations from Severa
     */

    getResourceAllocations: async () => {
      const url = `${baseUrl}/v1/resourceallocations`;

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
          `Failed to fetch resourceallocations: ${response.status} - ${response.statusText}`,
        );
      }
      const data = await response.json();
      // console.log("Users data:", data); // Log the response data
      return data;
    },

    getProjectHours: async (projectGuid: string) => {
      const url = `${baseUrl}/v1/projects/${projectGuid}/workhours?startDate=2024-11-26&endDate=2024-11-26`;

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
          `Failed to fetch projecthours: ${response.status} - ${response.statusText}`,
        );
      }
      const data = await response.json();
      // console.log("Users data:", data); // Log the response data
      return data;
    },

    /**
     * 
     * Gets users from Severa
     */

    getUsers: async () => {
      const url = `${baseUrl}/v1/users`;

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
      // console.log("Users data:", data); // Log the response data
      return data;
    },

    /**
     * Gets Workhours from Severa
     */
    getWorkhours: async () => {
      const url = `${baseUrl}/v1/workhours?eventDateStart=2024-11-26&eventDateEnd=2024-11-26`;

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
      // console.log("Users data:", data); // Log the response data
      return data;
  }};
}



/**
 * Gets Severa access token
 *
 * @returns Access token as string
 */
const getSeveraAccessToken = async (): Promise<string> => {
  
  const url: string = `${process.env.SEVERA_DEMO_BASE_URL}/v1/token`;
  const client_Id: string = process.env.SEVERA_DEMO_CLIENT_ID;
  const client_Secret: string = process.env.SEVERA_DEMO_CLIENT_SECRET;

  const requestBody = {
    client_id: client_Id,
    client_secret: client_Secret,
    scope: "users:read,hours:read,resourceallocations:read",
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
