/**
 * Severa model for Phases
 */
interface PhaseModel {
  severaPhaseId: string;
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
  severaProjectId: string;
  name: string;
  isClosed: boolean;
}

export default PhaseModel;