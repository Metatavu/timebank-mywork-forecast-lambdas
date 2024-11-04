
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
    status: VacationRequestStatuses;
    message: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
}

/**
 * Enumerator for the vacation request statuses
 */
enum VacationRequestStatuses {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "DECLINED"
}

/**
 * DynamoDB model for vacation type
 */
enum VacationType {
    VACATION = "VACATION"
}

export default VacationRequestModel;
  