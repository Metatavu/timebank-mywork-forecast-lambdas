interface SeveraResponsePhases {
  guid: string;
  name: string;
  isCompleted: boolean;
  workHoursEstimate: number;
  startDate: Date;
  deadLine: Date;
  project:{
    guid: string;
    name: string;
    isClosed: boolean;
  }
}

export default SeveraResponsePhases;