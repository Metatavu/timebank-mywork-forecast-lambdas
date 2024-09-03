import type { User } from "./schemas/keycloak/user";

export interface KeycloakApiService {
    getUsers: () => Promise<User[]>;
}

/**
 * Creates KeycloakApiService
 */
export function CreateKeycloakApiService(): KeycloakApiService {
    const baseUrl: string = process.env.KEYCLOAK_BASE_URL;
    const realm: string = process.env.KEYCLOAK_REALM

    return {
        /**
         * Gets all users from keycloak
         * 
         * @returns List of users
         */
        async getUsers(): Promise<User[]> {
            const response = await fetch(`${baseUrl}/realms/${realm}/users`)

            return response.json();
        },
    }
}