import { User } from "src/generated/client/api";

/*
    ResourceAllocation model
*/
interface ResourceAllocationModel {
    severaProjectGuid: string;
    allocationHours: number;
    calculatedAllocationHours: number;
    phase: PhaseSubModel;
    users: UserSubModel;
    projects: ResourceAllocationProjectSubModel;
}


interface PhaseSubModel {
    severaPhaseGuid: string;
    name: string;
}

interface UserSubModel {
    severaUserGuid: string;
    name: string;
}

interface ResourceAllocationProjectSubModel {
    severaProjectGuid: string;
    name: string;
    isInternal: boolean;
}

export default ResourceAllocationModel;