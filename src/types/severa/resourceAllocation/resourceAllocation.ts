/*
 *  ResourceAllocation model
*/
interface ResourceAllocationModel {
    severaProjectId: string;
    allocationHours: number;
    calculatedAllocationHours: number;
    phase?: PhaseSubModel;
    users: UserSubModel;
    projects?: ResourceAllocationProjectSubModel;
}

/*
 * Interface for PhaseSubModel
*/
interface PhaseSubModel {
    severaPhaseId: string;
    name: string;
}

/*
 * Interface for UserSubModel
*/
interface UserSubModel {
    severaUserId: string;
    name: string;
}

/*
 * Interface for ResourceAllocationProjectSubModel
*/
interface ResourceAllocationProjectSubModel {
    severaProjectId: string;
    name: string;
    isInternal: boolean;
}

export default ResourceAllocationModel;