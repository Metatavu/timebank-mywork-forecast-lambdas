import { cleanEnv, str, url } from "envalid";
import { Configuration, KeycloakConfiguration } from "../types/index";

const env = cleanEnv(process.env, {
    FORECAST_API_KEY: str(),
    FORECAST_BASE_URL: url(),
    KEYCLOAK_BASE_URL: url(),
    KEYCLOAK_REALM: str()
});

export default class Config {

    /**
     * Get static application configuration
     *
     * @returns promise of static application configuration
     */
    public static get = (): Configuration => ({
      forecast: {
        apiKey: env.FORECAST_API_KEY,
        baseUrl: env.FORECAST_BASE_URL
      },
      keycloak: {
        baseUrl: env.KEYCLOAK_BASE_URL,
        realm: env.KEYCLOAK_REALM
      }
    });

    /**
     * Gets Keycloak configuration
     * 
     */
    public static getKeycloakConfig(): KeycloakConfiguration {
      return {
        baseUrl: env.KEYCLOAK_BASE_URL,
        realm: env.KEYCLOAK_REALM
      };
    }; 
}