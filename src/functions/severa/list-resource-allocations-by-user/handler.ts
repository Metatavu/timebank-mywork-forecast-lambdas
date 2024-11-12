import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateSeveraApiService } from "src/database/services/severa-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Handler for getting resourceAllocation by user from Severa REST API.
 * 
 * @param event - API Gateway event containing the userId.
 */
export const getResourceAllocationHandler: APIGatewayProxyHandler = async (event) => {
    const severaUserId = event.pathParameters?.severaUserId;

    try {
        const api = CreateSeveraApiService();

        if(!severaUserId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User Id is required" }),
            };
        }

        const resourceAllocation = await api.getResourceAllocation(severaUserId);
        
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