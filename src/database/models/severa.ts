/**
 * What Flextime returns from Severa.
 */
export interface Flextime {
	totalFlextimeBalance: number | null; 
  monthFlextimeBalance: number | null;
}

export interface TotalTime {
  expectedHours: number;
  enteredHours: number;
  quantity: number;
  totalBillableTime: number;
  nonBillableProject: number;
}
