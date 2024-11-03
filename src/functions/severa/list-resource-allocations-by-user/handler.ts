import type { APIGatewayProxyHandler } from "aws-lambda";
import ResourceAllocationModel from "src/database/models/resourceAllocation";
import { CreateSeveraApiService } from "src/database/services/severa-api-service-TEMP";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for getting resourceAllocation by user from Severa REST API.
 * 
 * @param event - API Gateway event containing the user GUID.
 */
export const getResourceAllocationHandler: APIGatewayProxyHandler = async (event) => {
    const severaGuid = event.pathParameters?.severaGuid;

    try {
        const api = CreateSeveraApiService();

        if(!severaGuid) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User Guid is required" }),
            };
        }

        const resourceAllocation = await api.getResourceAllocation(severaGuid);
        console.log("Resource Allocation: ", resourceAllocation);
        
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