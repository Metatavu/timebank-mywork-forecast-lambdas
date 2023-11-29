import { cleanEnv, str } from "envalid";
import { Configuration } from "../types/index";

const env = cleanEnv(process.env, {
    FORECAST_API_KEY: str(),
    AUTH_ISSUER: str(),
    PIPEFRIVE_API_KEY: str()
});

export default class Config {

    /**
     * Get static application configuration
     *
     * @returns promise of static application configuration
     */
    public static get = (): Configuration => ({
      auth: {
        issuer: env.AUTH_ISSUER
      },  
      api: {
        apiKey: env.FORECAST_API_KEY
      },
      pipedriveApi: {
        apiKey: env.PIPEFRIVE_API_KEY
      }
    });
}