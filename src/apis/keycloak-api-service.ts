import type { User } from "./schemas/keycloak/user";

export interface KeycloakApiService {
    getUsers: () => Promise<User[]>,
    findUser: (userId: string) => Promise<User[]>
}

/**
 * Creates KeycloakApiService
 */
export function CreateKeycloakApiService(): KeycloakApiService {
    const baseUrl: string = process.env.KEYCLOAK_BASE_URL
    const realm: string = process.env.KEYCLOAK_REALM

    return {
        /**
         * Gets all users from keycloak
         * 
         * @returns List of users
         */
        async getUsers(): Promise<User[]> {
            const response = await fetch(`${baseUrl}/realms/${realm}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            })

            return response.json();
        },
/**
         * Find user from keycloak
         * 
         * @returns user by Id
         */
        async findUser(userId: string): Promise<User[]> {
            const response = await fetch(`${baseUrl}/realms/${realm}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                } 
            })

            return response.json();
        },

    }
}

async function getAccessToken(): Promise<string> {
    const baseUrl: string = `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`
    const requestBody = {
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        username: process.env.KEYCLOAK_ADMIN_USERNAME,
        password: process.env.KEYCLOAK_ADMIN_PASSWORD,
        grant_type: "client_credentials"
    };

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        const jsonResponse = await response.json()

        return jsonResponse.access_token
    } catch (error) {
        throw error(error)
    }
}