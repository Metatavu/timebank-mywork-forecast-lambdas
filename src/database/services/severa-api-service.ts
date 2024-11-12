import fetch from "node-fetch";
import type Flextime from "../models/severa";
import { FilterUtilities } from "src/libs/filter-utils";
import type ResourceAllocationModel from "../models/resourceAllocation";
import type Phase from "@database/models/phase";
import type WorkHours from "@database/models/workHours";
import * as process from "node:process";





/**
 * Interface for a SeveraApiService.
 */
export interface SeveraApiService {
  getFlextimeBySeveraUserId: (severaUserId: string, eventDate: string) => Promise<Flextime>;
  getResourceAllocation: (severaUserId: string) => Promise<ResourceAllocationModel[]>;
  getPhasesBySeveraProjectId: (severaProjectId: string) => Promise<Phase[]>;
  getWorkHoursBySeveraId: ( severaProjectId?: string, severaUserId?: string, severaPhaseId?: string ) => Promise<WorkHours[]>;
}

/**
 * Creates SeveraApiService
 */
export const CreateSeveraApiService = (): SeveraApiService => {
  const baseUrl: string = process.env.SEVERA_DEMO_BASE_URL;

  return {
    /**
     * Gets flextime by userId and eventDate
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
        const resourceAllocations = await response.json();
        const transformedResourceAllocations: ResourceAllocationModel[] = resourceAllocations.map((item:any) => ({
          severaProjectId: item.guid,
          allocationHours: item.allocationHours,
          calculatedAllocationHours: item.calculatedAllocationHours,
          phase: {
              severaPhaseId: item.phase?.guid,
              name: item.phase?.name,
          },
          users: {
              severaUserId: item.user?.guid,
              name: item.user?.name,
          },
          projects: {
              severaProjectId: item.project?.guid,
              name: item.project?.name,
              isInternal: item.project?.isInternal,
          },
      }))
        return transformedResourceAllocations;
    },

    /**
     * Gets phases by userId
     */
    getPhasesBySeveraProjectId: async (severaProjectId: string) : Promise<Phase[]> => {
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

      const phases = await response.json();

      return phases.map((item: any) => ({
        severaPhaseId: item.guid,
        name: item.name,
        isCompleted: item.isCompleted,
        workHoursEstimate: item.workHoursEstimate,
        startDate: item.startDate,
        deadLine: item.deadLine,
        project: {
          severaProjectId: item.project.guid,
          name: item.project.name,
          isClosed: item.project.isClosed,
        },
      }));
    },

    /**
     * Gets work hours by userId
     */
    getWorkHoursBySeveraId: async (severaProjectId?:string, severaUserId?: string, severaPhaseId?: string) : Promise<WorkHours[]> => {

      const url: string = 
      severaProjectId 
          ? `${baseUrl}/v1/projects/${severaProjectId}/workhours` 
          : severaUserId 
            ? `${baseUrl}/v1/users/${severaUserId}/workhours`
            : `${baseUrl}/v1/workhours`;
    
      console.log("severaProjectId", severaProjectId)
      console.log("severaUserId", severaUserId)
      console.log("severaPhaseId", severaPhaseId)
      console.log("url", url)

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
          `Failed to fetch work hours: ${response.status} - ${response.statusText}`,
        );
      }

      const workHours = await response.json();

      const filteredWorkHoursUser = workHours.filter(workHours => {
        return FilterUtilities.filterByUserSevera(workHours.user.guid, severaUserId)
      })

      const filteredWorkHoursPhase = workHours.filter(workHours => {
        return FilterUtilities.filterByPhaseSevera(workHours.phase.guid, severaPhaseId)
      })

      // Return work hours for a specific phaseID
      if(severaPhaseId){
        return filteredWorkHoursPhase.map(workHours => {
          return {
            severaWorkHoursId: workHours.guid,
            user: {
              name: workHours.user.name,
            },

            phase: {
              severaPhaseId: workHours.phase.guid,
              name: workHours.phase.name,
            },
            description: workHours.description,
            quantity: workHours.quantity,
          }
        })
      }

      // Return work hours for a specific userID
      if(severaUserId){
        return filteredWorkHoursUser.map(workHours => {
          return {
            severaWorkHoursId: workHours.guid,
            user: {
              severaUserId: workHours.user.guid,
              name: workHours.user.name,
            },
            project: {
              severaProjectId: workHours.project.guid,
              name: workHours.project.name,
              isClosed: workHours.project.isClosed,
            },
            phase: {
              severaPhaseId: workHours.phase.guid,
              name: workHours.phase.name,
            },
            description: workHours.description,
            eventDate: workHours.eventDate,
            quantity: workHours.quantity,
            startTime: workHours.startTime,
            endTime: workHours.endTime
          }
        })
      }

        return workHours.map((item: any) => ({
          user: {
            name: item.user.name,
          },
          project: {
            severaProjectId: item.project.guid,
            name: item.project.name,
            isClosed: item.project.isClosed,
          },
          phase: {
            severaPhaseId: item.phase.guid,
            name: item.phase.name
          },
          description: item.description,
          eventDate: item.eventDate,
          quantity: item.quantity,
          startTime: item.startTime,
          endTime: item.endTime,
        }));
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