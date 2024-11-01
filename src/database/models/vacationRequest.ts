/**
 * DynamoDB model for vacation request
 */
interface VacationRequestModel {
    id: string;
    personId: string;
    draft: boolean;
    startDate: string;
    endDate: string;
    days: number;
    type: VacationType;
    message: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
}

/**
 * DynamoDB model for vacation type
 */

enum VacationType {
    VACATION = "VACATION"
}

export default VacationRequestModel;
  