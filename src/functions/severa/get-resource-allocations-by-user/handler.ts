import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";
import type ResourceAllocationModel from "src/types/severa/resourceAllocation/resourceAllocation";
import type SeveraResponseResourceAllocation from "src/types/severa/resourceAllocation/severaResponseResourceAllocation";

/**
 * Handler for getting resourceAllocation by user from Severa REST API.
 * 
 * @param event - API Gateway event containing the userId.
 */
export const getResourceAllocationHandler: APIGatewayProxyHandler = async (event) => {
const {severaUserId} = event.pathParameters

try {
    const api = CreateSeveraApiService();

    if(!severaUserId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Id is required" }),
      };
    }

    const response = await api.getResourceAllocation(severaUserId);

    const mappedResourceAllocations = (severaData : SeveraResponseResourceAllocation[]) :ResourceAllocationModel[] => {
      return severaData.map((resourceAllocation) => ({
      severaResourceAllocationId: resourceAllocation.guid,
      allocationHours: resourceAllocation.allocationHours,
      calculatedAllocationHours: resourceAllocation.calculatedAllocationHours,
      phase: {
        severaPhaseId: resourceAllocation.phase?.guid,
        name: resourceAllocation.phase?.name,
      },
      users: {
        severaUserId: resourceAllocation.users?.guid,
        name: resourceAllocation.users?.name,
      },
      projects: {
        severaProjectId: resourceAllocation.projects?.guid,
        name: resourceAllocation.projects?.name,
        isInternal: resourceAllocation.projects?.isInternal,
      },
    }));
  }

    const resourceAllocations = mappedResourceAllocations(response);

    return {
      statusCode: 200,
      body: JSON.stringify(resourceAllocations),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}

export const main = middyfy(getResourceAllocationHandler);