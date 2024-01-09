import TimeUtilities from "src/meta-assistant/generic/time-utils";
import { DailyCombinedData } from "src/types/meta-assistant/index";
import { Person, DailyEntry, PersonTotalTime } from "src/generated/client/api";

export const personsMock: Person[] = [
  {
    id: 123,
    firstName:"tester",
    lastName: "test",
    email: "test",
    monday: 123,
    tuesday: 123,
    wednesday: 123,
    thursday: 123,
    friday: 123,
    saturday: 123,
    sunday: 123,
    active: true,
    language: "test",
    startDate: "test",
    unspentVacations: 0,
    spentVacations: 0,
    minimumBillableRate: 0
  },
  {
    id: 4040,
    firstName:"Meta",
    lastName: "T",
    email: "me@here",
    monday: 123,
    tuesday: 123,
    wednesday: 123,
    thursday: 123,
    friday: 123,
    saturday: 123,
    sunday: 123,
    active: true,
    language: "test",
    startDate: "test",
    unspentVacations: 0,
    spentVacations: 0,
    minimumBillableRate: 0
  },
  {
    id: 124,
    firstName:"on",
    lastName: "vacation",
    email: "me@vacation",
    monday: 100,
    tuesday: 123,
    wednesday: 123,
    thursday: 123,
    friday: 123,
    saturday: 123,
    sunday: 123,
    active: true,
    language: "test",
    startDate: "test",
    unspentVacations: 0,
    spentVacations: 0,
    minimumBillableRate: 0
  }
];

export const personsMock2: Person[] = [
  {
    id: 1,
    firstName:"tester",
    lastName: "test",
    email: "test",
    monday: 123,
    tuesday: 123,
    wednesday: 123,
    thursday: 123,
    friday: 123,
    saturday: 123,
    sunday: 123,
    active: true,
    language: "test",
    startDate: "test",
    unspentVacations: 0,
    spentVacations: 0,
    minimumBillableRate: 50
  },
  {
    id: 2,
    firstName:"tester2",
    lastName: "test",
    email: "test2",
    monday: 123,
    tuesday: 123,
    wednesday: 123,
    thursday: 123,
    friday: 123,
    saturday: 123,
    sunday: 123,
    active: true,
    language: "test",
    startDate: "test",
    unspentVacations: 0,
    spentVacations: 0,
    minimumBillableRate: 50
  },
  {
    id: 3,
    firstName:"tester3",
    lastName: "test",
    email: "test3",
    monday: 123,
    tuesday: 123,
    wednesday: 123,
    thursday: 123,
    friday: 123,
    saturday: 123,
    sunday: 123,
    active: true,
    language: "test",
    startDate: "test",
    unspentVacations: 0,
    spentVacations: 0,
    minimumBillableRate: 50
  }
];

export const personMock1: Person = {
  id: 1,
  firstName:"tester",
  lastName: "test",
  email: "test",
  monday: 123,
  tuesday: 123,
  wednesday: 123,
  thursday: 123,
  friday: 123,
  saturday: 123,
  sunday: 123,
  active: true,
  language: "test",
  startDate: "test",
  unspentVacations: 0,
  spentVacations: 0,
  minimumBillableRate: 0
};

export const personMock2: Person = {
  id: 3,
  firstName:"tester3",
  lastName: "test",
  email: "test3",
  monday: 123,
  tuesday: 123,
  wednesday: 123,
  thursday: 123,
  friday: 123,
  saturday: 123,
  sunday: 123,
  active: true,
  language: "test",
  startDate: "test",
  unspentVacations: 0,
  spentVacations: 0,
  minimumBillableRate: 0
};

export const personsErrorMock = {
  status: 404,
  message: "No persons found!"
};

export const dailyEntryMock1: DailyEntry[] = [
  {
    person: 123,
    internalTime: 123,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 123,
    expected: 123,
    balance: 1,
    date: new Date().toString(),
    isVacation: false
  }
];

export const dailyEntryMock2: DailyEntry[] = [
  {
    person: 4040,
    internalTime: 600,
    billableProjectTime: 500,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 600,
    expected: 500,
    balance: 123,
    date: new Date().toString(),
    isVacation: true
  }
];

export const dailyEntryMock3: DailyEntry[] = [
  {
    person: 124,
    internalTime: 0,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 0,
    expected: 100,
    balance: 0,
    date: new Date().toString(),
    isVacation: false
  }
];

export const dailyEntryMock4: DailyEntry[] = [
  {
    person: 3,
    internalTime: 600,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 600,
    expected: 1000,
    balance: -400,
    date: new Date().toString(),
    isVacation: false
  }
];

export const dailyEntryErrorMock = {
  status: 404,
  message: "No daily entries found!"
};

export const dailyEntryArrayMock: DailyEntry[] = [
  {
    person: 1,
    internalTime: 76,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 600,
    expected: 1000,
    balance: 100,
    date: new Date().toString(),
    isVacation: false
  },
  {
    person: 3,
    internalTime: 600,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 600,
    expected: 1000,
    balance: -400,
    date: new Date().toString(),
    isVacation: false
  },
  {
    person: 3,
    internalTime: 600,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 600,
    expected: 1000,
    balance: 10,
    date: new Date().toString(),
    isVacation: false
  },
  {
    person: 3,
    internalTime: 600,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 600,
    expected: 1000,
    balance: 100,
    date: new Date().toString(),
    isVacation: false
  },
  {
    person: 4040,
    internalTime: 600,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    logged: 600,
    expected: 500,
    balance: 123,
    date: new Date().toString(),
    isVacation: false
  }
];

const { weekStartDate } = TimeUtilities.lastWeekDateProvider();

export const personTotalTimeMock: PersonTotalTime = {
  personId: 1,
  balance: 0,
  logged: 60,
  expected: 120,
  internalTime: 60,
  billableProjectTime: 60,
  nonBillableProjectTime: 0,
  loggedProjectTime: 0,
};

export const personTotalTimeMock1: PersonTotalTime[] = [
  {
    personId: 2,
    balance: 32,
    logged: 2175,
    expected: 2175,
    internalTime: 2175,
    billableProjectTime: 50,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    timePeriod: `${weekStartDate.year},${weekStartDate.month},${weekStartDate.weekNumber}`
  }
];

export const personTotalTimeMock2: PersonTotalTime[] = [
  {
    personId: 3,
    balance: 0,
    logged: 100,
    expected: 100,
    internalTime: 25,
    billableProjectTime: 75,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    timePeriod: `${weekStartDate.year},${weekStartDate.month},${weekStartDate.weekNumber}`
  }
];

export const personTotalTimeMock3: PersonTotalTime[] = [
  {
    personId: 4,
    balance: 0,
    logged: 0,
    expected: 100,
    internalTime: 0,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    timePeriod: `${weekStartDate.year},${weekStartDate.month},${weekStartDate.weekNumber}`
  }
];

export const personTotalTimeMock4: PersonTotalTime[] = [
  {
    personId: 3,
    balance: 0,
    logged: 0,
    expected: 100,
    internalTime: 0,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    timePeriod: `${weekStartDate.year},${weekStartDate.month},${weekStartDate.weekNumber}`
  },
  {
    personId: 3,
    balance: 0,
    logged: 0,
    expected: 100,
    internalTime: 0,
    billableProjectTime: 100,
    nonBillableProjectTime: 0,
    loggedProjectTime: 0,
    timePeriod: `${weekStartDate.year},${weekStartDate.month},${weekStartDate.weekNumber}`
  }
];

export const personTotalTimeErrorMock = {
  status: 404,
  message: "Cannot calculate totals for given person"
};

export const dailyCombinedDataMock1: DailyCombinedData = {
  name: "user a",
  firstName: "user",
  personId: 1,
  expected: 100,
  logged: 100,
  minimumBillableRate: 0,
  billableProjectTime: 100,
  nonBillableProjectTime: 0,
  loggedProjectTime: 0,
  internalTime: 0,
  balance: 0,
  date: "2022-04-29"
};

export const dailyCombinedDataMock2: DailyCombinedData = {
  name: "user b",
  firstName: "user",
  personId: 2,
  expected: 150,
  logged: 100,
  minimumBillableRate: 0,
  billableProjectTime: 0,
  nonBillableProjectTime: 0,
  loggedProjectTime: 0,
  internalTime: 100,
  balance: -50,
  date: "2022-04-29"
};

export const dailyCombinedDataMock3: DailyCombinedData = {
  name: "user c",
  firstName: "user",
  personId: 3,
  expected: 100,
  logged: 100,
  minimumBillableRate: 0,
  billableProjectTime: 50,
  nonBillableProjectTime: 0,
  loggedProjectTime: 0,
  internalTime: 50,
  balance: 0,
  date: "2022-04-29"
};

export const dailyCombinedDataMock4: DailyCombinedData = {
  name: "user d",
  firstName: "user",
  personId: 4,
  expected: 100,
  logged: 150,
  minimumBillableRate: 0,
  billableProjectTime: 100,
  nonBillableProjectTime: 0,
  loggedProjectTime: 0,
  internalTime: 50,
  balance: 50,
  date: "2022-04-29"
};

export const dailyCombinedDataMock5: DailyCombinedData = undefined;

export const personSpecialCharsMock: Person[] = [
  {
    id: 123,
    firstName:"Ñöä!£",
    lastName: "Çøæé",
    email: "test",
    monday: 123,
    tuesday: 123,
    wednesday: 123,
    thursday: 123,
    friday: 123,
    saturday: 123,
    sunday: 123,
    active: true,
    language: "test",
    startDate: "test",
    unspentVacations: 0,
    spentVacations: 0,
    minimumBillableRate: 0
  }
];

export const dailyEntrySpecialCharsMock: DailyEntry[] = [{
  person: 123,
  internalTime: 600,
  billableProjectTime: 0,
  nonBillableProjectTime: 0,
  loggedProjectTime: 600,
  logged: 600,
  expected: 500,
  balance: 123,
  date: new Date().toString(),
  isVacation: false
}];