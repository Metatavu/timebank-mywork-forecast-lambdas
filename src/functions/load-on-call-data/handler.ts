import { S3 } from "aws-sdk"
import { OnCallEntry, PaidData } from "../../types";
import S3Utils from "@libs/s3-utils";
import { middyfy } from "@libs/lambda";
import Config from "../../app/config";

/**
 * Lambda method for loading on-call data
 * 
 * @param event event
 */
export const loadOnCallDataHandler = async (event: { queryStringParameters: { [key: string]: string } }) => {
    const { queryStringParameters } = event;
    
    const year = parseInt(queryStringParameters.year);
    if (!year || year < 2020 || year > new Date().getFullYear()) {
        throw new Error("Invalid year");
    }

    const s3 = new S3();

    const bucket = Config.get().onCall.bucketName;
    const nameMap = await S3Utils.loadJson<{ [key: string]: string } >(s3, bucket, "name-map.json") || {};
    const data = await S3Utils.loadJson<OnCallEntry[]>(s3, bucket, `${year}.json`);
    const paidData = await S3Utils.loadJson<PaidData>(s3, bucket, "paid.json") || {};

    if (!data) {
        throw new Error("No data");
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data.map((entry: any) => {
            return {
                ...entry,
                Person: nameMap[entry.Person] || entry.Person,
                Paid: paidData[year] && paidData[year][entry.Week] || false
            }
        }))
    };
}

export const main = middyfy(loadOnCallDataHandler);