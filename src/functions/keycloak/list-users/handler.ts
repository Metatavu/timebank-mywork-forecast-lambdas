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
 * Lambda for listing users
 */
const listUsersHandler: APIGatewayProxyHandler = async () => {
    const api = CreateKeycloakApiService();
    const users = await api.getUsers().then((users) => {
        return users.map(user => {
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isActive: user.isActive,
                severaGuid: user.severaGuid,
                forecastId: user.forecastId
            };
        });
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ users })
    };
}

export const main = middyfy(listUsersHandler)