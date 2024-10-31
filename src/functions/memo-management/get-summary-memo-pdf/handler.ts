import { APIGatewayProxyHandler } from "aws-lambda";
import { DateTime } from "luxon";
import { GoogleDriveService } from "src/database/services/google-api-service";
import { middyfy } from "src/libs/lambda";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";

const drive = new GoogleDriveService();

/**
 * Generates summary based on memo's content
 * 
 * @param date date
 * @param fileId ID of file
 * @returns generated summary text
 */
const getSummaryMemoPdf = async (date: DateTime, fileId: string) => {
  try {
    const file = await drive.getFile(fileId);
    if (!file) return;

    const fileSummary = (await drive.getFiles(date.year.toString(), date.monthLong, "application/vnd.google-apps.document"))
    .find(fileInFolder => `summary_${file.name}`.includes(fileInFolder.name));
    if (fileSummary) {
      const text = await drive.getFileText(fileSummary);
      return text;
    }
    
    const filesInBaseFolder = await drive.getFiles();
    const folderId = await drive.getFolderId(date.year.toString(), date.monthLong)
    const fileToGenerateSummary = filesInBaseFolder.find(fileInBaseFolder => file.name.includes(fileInBaseFolder.name));
    const summaryText = await drive.generateSummary(fileToGenerateSummary);

    await SlackUtilities.postSummaryToChannel(summaryText, file.name);
    await drive.createDocxSummary(summaryText, folderId, fileToGenerateSummary)
    return summaryText;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Lambda for generating memos summary
 * 
 * @param event event
 */
const getSummaryMemoPdfHandler: APIGatewayProxyHandler = async (event: any) => {
  const {queryStringParameters} = event;

  if (!queryStringParameters && !queryStringParameters?.fileId && !queryStringParameters?.date) {
    return  {
      statusCode: 400,
      body: 'Missing parameters'
    };
  }
  
  const summaryText =  await getSummaryMemoPdf(DateTime.fromISO(queryStringParameters.date), queryStringParameters.fileId);
  
  if (summaryText) 
    return {
      statusCode: 200,
      body: JSON.stringify(summaryText)
    }
  return {
    statusCode: 404,
    body: 'File not found'
  }
};

export const main = middyfy(getSummaryMemoPdfHandler);