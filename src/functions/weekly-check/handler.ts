import { S3 } from "aws-sdk"
import fetch from "node-fetch";
import { DateTime } from "luxon";
import { OnCallEntry } from "../../types"
import S3Utils from "@libs/s3-utils";
import { middyfy } from "@libs/lambda";

/**
 * Schedule from Splunk
 */
interface Schedule {
    team: {
        name: string;
        slug: string;
    },
    schedules: [
        {
            policy: {
                name: string;
                slug: string;
            },
            schedule: [
                {
                    onCallUser: {
                        username: string;
                    },
                    overrideOnCallUser?: {
                        username: string;
                    },
                    onCallType: string;
                    rotationName: string;
                    shiftName: string;
                    shiftRoll: string;
                    rolls: [
                        {
                            start: string;
                            end: string;
                            onCallUser: {
                                username: string;
                            },
                            isRoll: boolean
                        }
                    ]
                }
            ],
            overrides: any[]
        }
    ]
};

/**
 * Resolve next week from schedule
 * 
 * @param schedule schedule
 * @param nextThursday next Thursday
 * @param policyName name of policy
 * @returns week from schedule
 */
const getNextWeekFromSchedule = (schedule: Schedule, nextThursday: DateTime, policyName: string) => {
    const scheduleSchedule = schedule.schedules.find(shedule => shedule.policy.name === policyName)?.schedule[0];
    if (!scheduleSchedule) {
        return null;
    }

    const onCallUser = scheduleSchedule.onCallUser;
    const overrideOnCallUser = scheduleSchedule.overrideOnCallUser;
    const weekNumber = nextThursday.weekNumber;
    
    return {
        week: weekNumber,
        user: overrideOnCallUser == null ? onCallUser.username : overrideOnCallUser.username
    };
};

/**
 * Lambda for checking who is on call this week
 * 
 * @param event event
 */
export const weeklyCheckHandler = async () => {
    const { SPLUNK_SCHEDULE_POLICY_NAME, SPLUNK_TEAM_ONCALL_URL, SPLUNK_API_ID, SPLUNK_API_KEY } = process.env;
    if (!SPLUNK_SCHEDULE_POLICY_NAME || !SPLUNK_TEAM_ONCALL_URL || !SPLUNK_API_ID || !SPLUNK_API_KEY) {
        throw new Error('Missing environment variables');
    }

    const splunkTeamOnCallUrl = SPLUNK_TEAM_ONCALL_URL;
    
    const schedule = await (await fetch(`${splunkTeamOnCallUrl}/schedule?daysForward=4&daysSkip=3`, {
        headers: {
            'X-VO-Api-Id': SPLUNK_API_ID,
            'X-VO-Api-Key': SPLUNK_API_KEY,
            'Accept': 'application/json'
        } 
    })).json() as Schedule;

    const nextThursday = DateTime.now().plus({ days: 4 });
    const nextWeek = getNextWeekFromSchedule(schedule, nextThursday, SPLUNK_SCHEDULE_POLICY_NAME);
    if (!nextWeek) {
        throw new Error("No next week");
    }

    // const fileName = `${nextThursday.year}.json`;
    // const s3 = new S3();

    // const yearJson = (await S3Utils.loadJson<OnCallEntry[]>(s3, fileName)) || [];
    
    // const index = yearJson.findIndex(entry => entry.Week == nextWeek.week);
    // if (index > -1) {
    //     yearJson[index].Person = nextWeek.user;
    // } else {
    //     yearJson.push({
    //         Week: nextWeek.week,
    //         Person: nextWeek.user
    //     });
    // }

    // await S3Utils.saveJson(s3, fileName, yearJson);

    return {
        statusCode: 200,
        body: JSON.stringify(nextWeek)
      };
};

export const main = middyfy(weeklyCheckHandler);