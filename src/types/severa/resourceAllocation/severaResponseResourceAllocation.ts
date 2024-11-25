
interface SeveraResponseResourceAllocation {
    guid: string;
    allocationHours: number;
    calculatedAllocationHours: number;
    phase?: {
        guid: string;
        name: string;
    }
    users: {
        guid: string;
        name: string;
    }
    projects?: {
        guid: string;
        name: string;
        isInternal: boolean;
    }
}

export default SeveraResponseResourceAllocation;