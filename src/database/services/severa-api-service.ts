import fetch from "node-fetch";
import type { Flextime, getWorkhours, SeveraUsers, WorkDays } from "../models/severa";
import { DateTime } from "luxon";
import type SeveraResponseWorkHours from "src/types/severa/workHour/severaResponseWorkHours";
import type SeveraResponsePhases from "src/types/severa/phase/severaResponsePhases";
import type SeveraResponseResourceAllocation from "src/types/severa/resourceAllocation/severaResponseResourceAllocation";

/**
 * Interface for a SeveraApiService.
 */
export interface SeveraApiService {
  getFlextimeBySeveraUserId: (severaUserId: string, eventDate: string) => Promise<Flextime>;
  getResourceAllocation: (severaUserId: string) => Promise<SeveraResponseResourceAllocation[]>;
  getPhasesBySeveraProjectId: (severaProjectId: string) => Promise<SeveraResponsePhases[]>;
  getWorkHours: (endpointPath: URL, startDate?: string, endDate?: string) => Promise<SeveraResponseWorkHours[]>;
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
     * 
     * @param severaUserId  Severa user id
     * @returns Flextime of a user
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
      return response.json();
    },

    /** 
     * Get resource allocation by userId
     * 
     * @param severaUserId Severa user id
     * @returns Resource allocation of a user
     */
       getResourceAllocation: async (severaUserId: string) => {
        const url: string = `${baseUrl}/v1/users/${severaUserId}/resourceallocations/allocations`;
        const response = await fetch(url,{
            method: "GET",
            headers: {
                Authorization: `Bearer ${await getSeveraAccessToken()}`,
                "Client_Id": process.env.SEVERA_DEMO_CLIENT_ID,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch resource allocation: ${response.status} - ${response.statusText}`,
            );
        }
        return response.json();
    },

    /**
     * Gets phases by projectId
     * 
     * @param severaProjectId Severa project id
     * @returns Phases of a project
     */
    getPhasesBySeveraProjectId: async (severaProjectId: string) => {
      const url: string = `${baseUrl}/v1/projects/${severaProjectId}/phaseswithhierarchy`;

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
          `Failed to fetch phases: ${response.status} - ${response.statusText}`,
        );
      }
      return response.json();
    },

    /**
     * Gets work hours
     * 
     * @param url custom url for fetching work hours depending on queryparameters requirements
     * @returns Work hours  
     */
    getWorkHours: async (endpointPath: URL) => {
      const response = await fetch(`${endpointPath}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getSeveraAccessToken()}`,
          "Client_Id": process.env.SEVERA_DEMO_CLIENT_ID,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(
          `Failed to fetch work hours: ${response.status} - ${response.statusText}`,
        );
      }      const data = await response.json();
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
    scope: "projects:read, resourceallocations:read, hours:read, users:read,hours:read,resourceallocations:read",
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
