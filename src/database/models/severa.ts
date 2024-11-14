/**
 * What Flextime returns from Severa.
 */
export interface Flextime {
	totalFlextimeBalance: number | null; 
  monthFlextimeBalance: number | null;
}

export interface getUsers {
  id: string;
  name: string;
  email: string;
}
