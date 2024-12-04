/**
 * Interface for PreviousWorkHoursModel
 */
interface PreviousWorkHoursModel {
  guid: string;
  user: PreviousWorkHoursUserModel;
  project: PreviousWorkHoursProjectModel;
  phase: PreviousWorkHoursPhaseModel;
  isBillable: boolean;
  eventDate: string;
  quantity: number;
}

/**
 * Interface for PreviousWorkHoursUserModel
 */
interface PreviousWorkHoursUserModel {
  guid: string;
  name: string;
  firstName: string;
  lastName: string;
}

/**
 * Interface for PreviousWorkHoursProjectModel
 */
interface PreviousWorkHoursProjectModel {
  guid: string;
}

/**
 * Interface for PreviousWorkHoursPhaseModel
 */
interface PreviousWorkHoursPhaseModel {
  guid: string;
  name: string;
}