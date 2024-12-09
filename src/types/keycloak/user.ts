/**
 * Custom Interface for a user in keycloak functions with isActive, severaGuid, forecastID .
 */
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    attributes: Attribute[];
}

/**
 * Custom Interface for user`s custom attributes.
 */
export interface Attribute {
    isActive: boolean;
    severaOptIn: boolean;
    severaUserId: string;
    vacationDaysByYear: string;
    unspentVacationDaysByYear: string;
    passedQuestionnaires: string[];
}