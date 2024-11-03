import { User } from "src/generated/client/api";

/*
    ResourceAllocation model
*/
interface ResourceAllocationModel {
    severaProjectGuid: string;
    allocationHours: number;
    calculatedAllocationHours: number;
    phase: BaseSubmodel;
    users: BaseSubmodel;
    projects: ResourceAllocationProjectSubModel;
}

interface BaseSubmodel {
    severaGuid: string;
    name: string;
}

// interface PhaseSubModel {
//     severaPhaseGuid: string;
//     name: string;
// }

// interface UserSubModel {
//     severaUserGuid: string;
//     name: string;
// }

interface ResourceAllocationProjectSubModel {
    severaProjectGuid: string;
    name: string;
    isInternal: boolean;
}

export default ResourceAllocationModel;