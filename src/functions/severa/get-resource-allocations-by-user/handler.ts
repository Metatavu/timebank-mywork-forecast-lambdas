import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/services/severa-api-service";
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

  if(!severaUserId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "User Id is required" }),
    };
  }

  try {
    const api = CreateSeveraApiService();

    const response = await api.getResourceAllocation(severaUserId);

    /**
     * Maps the Severa API response data to the ResourceAllocation model.
     *
     * @param {SeveraResponseResourceAllocation[]} severaData - Array of resourceAllocation data from the Severa API.
     * @returns {ResourceAllocationModel[]} - An array of resourceAllocations mapped to the ResourceAllocation model.
     */
    const mappedResourceAllocations = (severaData : SeveraResponseResourceAllocation[]): ResourceAllocationModel[] => (
      severaData.map((resourceAllocation) => ({
        severaResourceAllocationId: resourceAllocation.guid,
        allocationHours: resourceAllocation.allocationHours,
        calculatedAllocationHours: resourceAllocation.calculatedAllocationHours,
        phase: {
          severaPhaseId: resourceAllocation.phase?.guid,
          name: resourceAllocation.phase?.name,
        },
        users: {
          severaUserId: resourceAllocation.user?.guid,
          name: resourceAllocation.user?.name,
        },
        projects: {
          severaProjectId: resourceAllocation.project?.guid,
          name: resourceAllocation.project?.name,
          isInternal: resourceAllocation.project?.isInternal,
        },
      }))
  );
  
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