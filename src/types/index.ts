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
  }
 }

 /**
 * Paid year interface
 */
export interface PaidYear {
  [week: number ]: boolean
}

/**
* Paid data interface
*/
export interface PaidData {
  [year: number ]: PaidYear
}

/**
* On call entry interface
*/
export interface OnCallEntry {
  Week: number;
  Person: string; 
}