import { S3 } from "aws-sdk"
import { OnCallEntry, PaidData } from "../../../types/on-call";
import S3Utils from "@libs/s3-utils";
import { middyfy } from "@libs/lambda";
import Config from "../../../app/config";
import { ValidatedEventAPIGatewayProxyEvent } from "src/libs/api-gateway";

/**
 * Lambda method for loading on-call data
 * 
 * @param event event
 */
export const listOnCallDataHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event: { queryStringParameters: { [key: string]: string } }) => {
  const { queryStringParameters } = event;

  const year = parseInt(queryStringParameters.year);
  if (!year || year < 2020 || year > new Date().getFullYear()) {
    throw new Error("Invalid year");
  }

  const s3 = new S3();

  const nameMapFile = "name-map.json";
  const yearFile = `${year}.json`;
  const paidFile = "paid.json";

  const bucket = Config.get().onCall.bucketName;
  const nameMap = await S3Utils.loadJson<{ [key: string]: string }>(s3, bucket, nameMapFile) || {};
  const data = await S3Utils.loadJson<OnCallEntry[]>(s3, bucket, yearFile);
  const paidData = await S3Utils.loadJson<PaidData>(s3, bucket, paidFile) || {};

  if (!data || !nameMap || !paidData) {
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

export const main = middyfy(listOnCallDataHandler);