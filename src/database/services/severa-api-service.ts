import fetch from "node-fetch";
import type Flextime from "../models/severa";
import type ResourceAllocation from "../models/resourceAllocation";
import type Phase from "@database/models/phase";
import type WorkHours from "@database/models/workHours";
import * as process from "node:process";
import { DateTime } from "luxon";

/**
 * Interface for a SeveraApiService.
 */
export interface SeveraApiService {
  getFlextimeBySeveraUserId: (severaUserId: string) => Promise<Flextime>;
  getResourceAllocation: (severaUserId: string) => Promise<ResourceAllocation[]>;
  getPhasesBySeveraProjectId: (severaProjectId: string) => Promise<Phase[]>;
  getWorkHoursBySeveraId: ( severaProjectId?: string, severaUserId?: string, severaPhaseId?: string, startDate?: string, endDate?: string) => Promise<WorkHours[]>;
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
      return response.json();
    },

    /** 
     * Get resource allocation by userId
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
     * Gets phases by userId
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
     * Gets work hours by userId
     */
    getWorkHoursBySeveraId: async (url: string, startDate?: string, endDate?: string) => {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(`${baseUrl}/v1/${url}`, {
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
  // if (process.env.IS_OFFLINE) {
  //   return "test-token";
  // }
  
  const url: string = `${process.env.SEVERA_DEMO_BASE_URL}/v1/token`;
  const client_Id: string = process.env.SEVERA_DEMO_CLIENT_ID;
  const client_Secret: string = process.env.SEVERA_DEMO_CLIENT_SECRET;

  const requestBody = {
    client_id: client_Id,
    client_secret: client_Secret,
    scope: "projects:read, resourceallocations:read, hours:read",
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