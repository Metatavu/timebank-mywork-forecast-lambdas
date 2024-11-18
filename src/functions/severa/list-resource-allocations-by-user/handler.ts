import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

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

        const resourceAllocation = response.map((item:any) => ({
            severaResourceAllocationId: item.guid,
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
        return {
            statusCode: 200,
            body: JSON.stringify(resourceAllocation),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }
}

export const main = middyfy(getResourceAllocationHandler);