

/**
 * Date range type
 */
export type DateRange = { 
  startDate: string, 
  endDate: string 
};

/**
 * Access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  email?: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
  roles?: string[];
}

/**
 * Application configuration
 */
 export interface Configuration {
  forecast: {
    apiKey: string;
    baseUrl: string;
  },
  keycloak: KeycloakConfiguration
 }

 export interface KeycloakConfiguration {
  baseUrl: string;
  realm: string;
 }