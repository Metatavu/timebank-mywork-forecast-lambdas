/*
*  ResourceAllocation model
*/
interface ResourceAllocationModel {
  severaProjectId: string;
  allocationHours: number;
  calculatedAllocationHours: number;
  phase: ResourceAllocationPhaseSubModel;
  users: ResourceAllocationUserSubModel;
  projects: ResourceAllocationProjectSubModel;
}

/*
* Interface for PhaseSubModel
*/
interface ResourceAllocationPhaseSubModel {
  severaPhaseId: string;
  name: string;
}

/*
* Interface for UserSubModel
*/
interface ResourceAllocationUserSubModel {
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