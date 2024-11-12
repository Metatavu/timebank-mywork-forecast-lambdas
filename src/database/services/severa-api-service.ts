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
  getResourceAllocation: (severaGuid: string) => Promise<ResourceAllocationModel[]>;
  getPhasesBySeveraProjectGuid: (severaProjectGuid: string) => Promise<Phase[]>;
  getWorkHoursBySeveraGuid: ( severaProjectGuid?: string, severaUserGuid?: string, severaPhaseGuid?: string ) => Promise<WorkHours[]>;
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

      return response.json();
    },

       /** 
     * Get resource allocation by userGUID 
     */
       getResourceAllocation: async (severaGuid: string) => {
        const url: string = `${baseUrl}/v1/users/${severaGuid}/resourceallocations/allocations`;
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
          severaProjectGuid: item.guid,
          allocationHours: item.allocationHours,
          calculatedAllocationHours: item.calculatedAllocationHours,
          phase: {
              severaPhaseGuid: item.phase?.guid,
              name: item.phase?.name,
          },
          users: {
              severaUserGuid: item.user?.guid,
              name: item.user?.name,
          },
          projects: {
              severaProjectGuid: item.project?.guid,
              name: item.project?.name,
              isInternal: item.project?.isInternal,
          },
      }))
        return transformedResourceAllocations;
    },

    /**
     * Gets phases by userGUID
     */
    getPhasesBySeveraProjectGuid: async (severaProjectGuid: string) : Promise<Phase[]> => {
      const url: string = `${baseUrl}/v1/projects/${severaProjectGuid}/phaseswithhierarchy`;

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
        severaPhaseGuid: item.guid,
        name: item.name,
        isCompleted: item.isCompleted,
        workHoursEstimate: item.workHoursEstimate,
        startDate: item.startDate,
        deadLine: item.deadLine,
        project: {
          severaProjectGuid: item.project.guid,
          name: item.project.name,
          isClosed: item.project.isClosed,
        },
      }));
    },

    /**
     * Gets work hours by userGUID
     */
    getWorkHoursBySeveraGuid: async (severaProjectGuid?:string, severaUserGuid?: string, severaPhaseGuid?: string) : Promise<WorkHours[]> => {

      const url: string = 
        severaProjectGuid 
          ? `${baseUrl}/v1/projects/${severaProjectGuid}/workhours` 
          : severaUserGuid 
            ? `${baseUrl}/v1/users/${severaUserGuid}/workhours`
            : `${baseUrl}/v1/workhours`;
    
      console.log("severaProjectGuid", severaProjectGuid)
      console.log("severaUserGuid", severaUserGuid)
      console.log("severaPhaseGuid", severaPhaseGuid)
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
        return FilterUtilities.filterByUserSevera(workHours.user.guid, severaUserGuid)
      })

      const filteredWorkHoursPhase = workHours.filter(workHours => {
        return FilterUtilities.filterByPhaseSevera(workHours.phase.guid, severaPhaseGuid)
      })

      // Return work hours for a specific phaseID
      if(severaPhaseGuid){
        return filteredWorkHoursPhase.map(workHours => {
          return {
            severaWorkHoursGuid: workHours.guid,
            user: {
              name: workHours.user.name,
            },

            phase: {
              severaPhaseGuid: workHours.phase.guid,
              name: workHours.phase.name,
            },
            description: workHours.description,
            quantity: workHours.quantity,
          }
        })
      }

      // Return work hours for a specific userID
      if(severaUserGuid){
        return filteredWorkHoursUser.map(workHours => {
          return {
            severaWorkHoursGuid: workHours.guid,
            user: {
              severaUserGuid: workHours.user.guid,
              name: workHours.user.name,
            },
            project: {
              severaProjectGuid: workHours.project.guid,
              name: workHours.project.name,
              isClosed: workHours.project.isClosed,
            },
            phase: {
              severaPhaseGuid: workHours.phase.guid,
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
            severaProjectGuid: item.project.guid,
            name: item.project.name,
            isClosed: item.project.isClosed,
          },
          phase: {
            severaPhaseGuid: item.phase.guid,
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
  
  if (process.env.IS_OFFLINE) {
    return "test-token";
  }
  
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