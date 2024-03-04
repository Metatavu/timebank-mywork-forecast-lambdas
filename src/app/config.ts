import { cleanEnv, str } from "envalid";
import { Configuration } from "src/types";

const env = cleanEnv(process.env, {
  FORECAST_API_KEY: str(),
  AUTH_ISSUER: str(),
  ON_CALL_BUCKET_NAME: str(),
  PIPEDRIVE_API_KEY: str(),
  PIPEDRIVE_API_URL: str(),
  SPLUNK_API_KEY: str(),
  SPLUNK_API_ID: str(),
  SPLUNK_TEAM_ONCALL_URL: str(),
  SPLUNK_SCHEDULE_POLICY_NAME : str(),
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
    onCall: {
      bucketName: env.ON_CALL_BUCKET_NAME
    },
    pipedriveApi: {
      apiKey: env.PIPEDRIVE_API_KEY,
      apiUrl: env.PIPEDRIVE_API_URL
    },
    splunkApi : {
      apiKey: env.SPLUNK_API_KEY,
      apiId: env.SPLUNK_API_ID,
      teamOnCallUrl: env.SPLUNK_TEAM_ONCALL_URL,
      schedulePolicyName: env.SPLUNK_SCHEDULE_POLICY_NAME
    }
  });
}