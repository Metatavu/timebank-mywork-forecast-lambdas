/**
 * What Flextime returns from Severa.
 */
export interface Flextime {
	totalFlextimeBalance: number | null; 
  monthFlextimeBalance: number | null;
}

export interface getWorkhours {
  id: string;
  name: string;
  email: string;
}

export interface SeveraUsers {
  id: number;
  name: string;
}

export interface WorkDays {
  id: string;
  name: string;
}

export interface ResourceAllocations {
  id: number;
  name: string;
  allocationHours: number;
}
