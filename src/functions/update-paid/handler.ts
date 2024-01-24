import { S3 } from "aws-sdk"
import { PaidData } from "../../types"
import S3Utils from "@libs/s3-utils";
import Config from "src/app/config";
import { middyfy } from "@libs/lambda";

/**
 * Request body interface
 */
interface RequestBody {
    year: number;
    week: number;
    paid: boolean;
}

/**
 * Lambda method for updating paid data
 * 
 * @param event event
 */
export const updatePaidHandler = async (event: { body: string }) => {
    const requestBody: RequestBody = JSON.parse(event.body);
    const { year, week, paid } = requestBody;

    if (!year || year < 2020 || year > new Date().getFullYear()) {
        throw new Error("Invalid year");
    }

    if (!week || week < 1 || week > 53) {
        throw new Error("Invalid week");
    }
    
    const s3 = new S3();
    const bucket = Config.get().onCall.bucketName;
    
    const paidData = await S3Utils.loadJson<PaidData>(s3, bucket, "paid.json") || {};
    paidData[year] = paidData[year] || {};
    paidData[year][week] = paid;
    
    await S3Utils.saveJson(s3, bucket, "paid.json", paidData);
};
export const main = middyfy(updatePaidHandler);