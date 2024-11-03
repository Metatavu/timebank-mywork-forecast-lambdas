import { APIGatewayProxyHandler } from "aws-lambda";
import { DateTime } from "luxon";
import { getFile, getFiles, getFileText, getFolderId, generateSummary, createDocxSummary } from "src/database/services/google-api-service";
import { middyfy } from "src/libs/lambda";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";

/**
 * Generates summary based on memo's content
 * 
 * @param date date
 * @param fileId ID of file
 * @returns generated summary text
 */
const getSummaryMemoPdf = async (date: DateTime, fileId: string) => {
  try {
    const file = await getFile(fileId);
    if (!file) return;

    const fileSummary = (await getFiles(date.year.toString(), date.monthLong, "application/vnd.google-apps.document"))
    .find(fileInFolder => `summary_${file.name}`.includes(fileInFolder.name));
    if (fileSummary) {
      const text = await getFileText(fileSummary);
      return text;
    }
    
    const filesInBaseFolder = await getFiles();
    const folderId = await getFolderId(date.year.toString(), date.monthLong)
    const fileToGenerateSummary = filesInBaseFolder.find(fileInBaseFolder => file.name.includes(fileInBaseFolder.name));
    const summaryText = await generateSummary(fileToGenerateSummary);

    await SlackUtilities.postSummaryToChannel(summaryText, file.name);
    await createDocxSummary(summaryText, folderId, fileToGenerateSummary)
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
  const splittedText = summaryText.split(/\r\n\r\n\r\n/);
  console.log(splittedText[0])
  
  if (summaryText) 
    return {
      statusCode: 200,
      body: JSON.stringify({en: splittedText[0], fi: splittedText[1]})
    }
  return {
    statusCode: 404,
    body: 'File not found'
  }
};

export const main = middyfy(getSummaryMemoPdfHandler);