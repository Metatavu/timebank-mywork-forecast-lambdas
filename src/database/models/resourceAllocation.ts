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
    severaUserGuid: string;
    name: string;
}

interface ResourceAllocationProjectSubModel {
    severaProjectGuid: string;
    name: string;
    isInternal: boolean;

}