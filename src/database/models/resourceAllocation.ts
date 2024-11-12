/*
 *  ResourceAllocation model
*/
interface ResourceAllocationModel {
    severaProjectGuid: string;
    allocationHours: number;
    calculatedAllocationHours: number;
    phase: PhaseSubModel;
    users: UserSubModel;
    projects: ResourceAllocationProjectSubModel;
}

/*
 * Interface for PhaseSubModel
*/
interface PhaseSubModel {
    severaPhaseGuid: string;
    name: string;
}

/*
 * Interface for UserSubModel
*/
interface UserSubModel {
    severaUserGuid: string;
    name: string;
}

/*
 * Interface for ResourceAllocationProjectSubModel
*/
interface ResourceAllocationProjectSubModel {
    severaProjectGuid: string;
    name: string;
    isInternal: boolean;
}

export default ResourceAllocationModel;