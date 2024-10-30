declare module 'keycloak-js' {
  export interface KeycloakProfile {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
		severaGuid?: string;
  }
}