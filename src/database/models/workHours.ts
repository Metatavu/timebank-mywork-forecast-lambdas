import type {DateTime} from "luxon";

/**
 * Severa model for Work Hours
 */
interface WorkHoursModel {
  severaWorkHoursGuid: string;
  user: UserSubModel;
  project: ProjectSubModel;
  phase: PhaseSubModel;
  description: string;
  eventDate: Date;
  quantity: number;
  startTime: DateTime;
  endTime: DateTime;
}

/**
 * Severa sub model for user
 */
interface UserSubModel {
  severaUserGuid: string;
  name: string;
}

/**
 * Severa sub model for project
 */
interface ProjectSubModel {
  severaProjectGuid: string;
  name: string;
  isClosed: boolean;
}

/**
 * Severa sub model for phase
 */
interface PhaseSubModel {
  severaPhaseGuid: string;
  name: string;
}

export default WorkHoursModel;