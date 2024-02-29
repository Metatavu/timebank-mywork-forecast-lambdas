/**
 * Date range type
 */
export type DateRange = {
  start_date: string,
  end_date: string
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
  auth: {
    issuer: string;
  },
  api: {
    apiKey: string;
  },
  onCall: {
    bucketName: string;
  },
  pipedriveApi: {
    apiKey: string,
    apiUrl: string
  },
  splunkApi: {
    apiKey: string
    apiId: string,
    teamOnCallUrl: string,
    schedulePolicyName: string
  }
}

/**
* Paid year interface
*/
export interface PaidYear {
  [week: number]: boolean
}

/**
* Paid data interface
*/
export interface PaidData {
  [year: number]: PaidYear
}

/**
* On call entry interface
*/
export interface OnCallEntry {
  Week: number;
  Person: string;
}

/**
 * Request body interface
 */
export interface UpdatePaidRequestBody {
  year: number;
  week: number;
  paid: boolean;
}

/**
 * Schedule from Splunk
 */
export interface SplunkSchedule {
  team: {
    name: string;
    slug: string;
  },
  schedules: [
    {
      policy: {
        name: string;
        slug: string;
      },
      schedule: [
        {
          onCallUser: {
            username: string;
          },
          overrideOnCallUser?: {
            username: string;
          },
          onCallType: string;
          rotationName: string;
          shiftName: string;
          shiftRoll: string;
          rolls: [
            {
              start: string;
              end: string;
              onCallUser: {
                username: string;
              },
              isRoll: boolean
            }
          ]
        }
      ],
      overrides: any[]
    }
  ]
};