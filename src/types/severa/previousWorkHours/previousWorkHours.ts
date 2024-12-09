/**
 * Interface for PreviousWorkHoursModel
 */
interface PreviousWorkHoursModel {
  id: string;
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
  id: string;
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

export default PreviousWorkHoursModel;