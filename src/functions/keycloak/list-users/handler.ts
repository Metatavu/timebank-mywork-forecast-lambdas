import { middyfy } from "@libs/lambda";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { CreateKeycloakApiService, type KeycloakApiService } from "src/apis/keycloak-api-service";


/**
 * Response schema for lambda
 */
interface Response {
    id: string
    firstName: string
    lastName: string
    email: string
    isActive: boolean
    severaGuid: string
    forecastId: number
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
        throw error()
    }
}

/**
 * Lambda for listing users
 * 
 * @param _event event
 */
const listUsersHandler: APIGatewayProxyHandler = async (_event) => {
    try {
        const api = CreateKeycloakApiService();
        const users = await listUsers(api)

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(users)
        }
    } catch (error){
    
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: error }),
        };
    }
}

export const main = middyfy(listUsersHandler)