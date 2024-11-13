import type {DateTime} from "luxon";

/**
 * Severa model for Work Hours
 */
interface WorkHoursModel {
  severaWorkHoursId: string;
  user: UserSubModel;
  project: ProjectSubModel;
  phase: PhaseSubModel;
  description: string;
  eventDate: string;
  quantity: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Severa sub model for user
 */
interface UserSubModel {
  severaUserId: string;
  name: string;
}

/**
 * Severa sub model for project
 */
interface ProjectSubModel {
  severaProjectId: string;
  name: string;
  isClosed: boolean;
}

/**
 * Severa sub model for phase
 */
interface PhaseSubModel {
  severaPhaseId: string;
  name: string;
}

export default WorkHoursModel;