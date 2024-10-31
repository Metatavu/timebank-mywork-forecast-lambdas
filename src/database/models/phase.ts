/**
 * Severa model for Phases
 */
interface PhaseModel {
  severaPhaseGuid: string;
  name: string;
  isCompleted: boolean;
  workHoursEstimate: number;
  startDate: Date;
  deadLine: Date;
  project: PhaseProjectSubModel;
}

/**
 * Severa model for project
 */
interface PhaseProjectSubModel{
  severaProjectGuid: string;
  name: string;
  isClosed: boolean;
}

export default PhaseModel;