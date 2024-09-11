import { middyfy } from "@libs/lambda";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { error } from "console";
import { CreateKeycloakApiService, type KeycloakApiService } from "src/apis/keycloak-api-service";

/**
 * Response schema for lambda
 */
interface Response {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    severaGuid: string;
    forecastId: number;
}

/**
 * Gets all users
 * 
 * @param api
 * @returns Array of users 
 */
const listUsers = async (api: KeycloakApiService): Promise<Response[]> => {
    try {
        const users = await api.getUsers()

        return users.map(user => {
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isActive: user.isActive,
                severaGuid: user.severaGuid,
                forecastId: user.forecastId
            }
    })
    } catch (error) {
        throw error("Error when listing users")
    }
}

/**
 * Lambda for listing users
 */
const listUsersHandler: APIGatewayProxyHandler = async () => {
    try {
        const api = CreateKeycloakApiService();
        const users = await listUsers(api)

        return {
            statusCode: 200,
            body: JSON.stringify({ users })
        }
    } catch (_error){
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error when listing users" }),
        };
    }
}

export const main = middyfy(listUsersHandler)