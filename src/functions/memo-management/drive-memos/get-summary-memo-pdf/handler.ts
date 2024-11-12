import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DateTime } from "luxon";
import { getFile, getFiles, getFileText, getFolderId } from "src/service/google-drive-api-service";
import { middyfy } from "src/libs/lambda";
import SlackUtilities from "src/meta-assistant/slack/slack-utils";
import { generateSummary } from "src/service/open-api-service";
import { createDocSummary } from "src/service/google-docs-api-service";

/**
 * Generates summary based on memo's content
 * 
 * @param date date
 * @param fileId ID of file
 * @returns generated summary text
 */
const getSummaryMemoPdf = async (date: DateTime, fileId: string) => {
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
  await createDocSummary(summaryText, folderId, fileToGenerateSummary)
  return summaryText;
}

/**
 * Lambda for generating memos summary
 * 
 * @param event event
 */
const getSummaryMemoPdfHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const {queryStringParameters} = event;

  if (!queryStringParameters && !queryStringParameters?.fileId && !queryStringParameters?.date) {
    return  {
      statusCode: 400,
      body: "Missing parameters"
    };
  }
  try {
    const summaryText =  await getSummaryMemoPdf(DateTime.fromISO(queryStringParameters.date), queryStringParameters.fileId);
    const paragraphSeparator = /\r\n\r\n\r\n/;
    const splittedText = summaryText.split(paragraphSeparator);
    if (summaryText) 
      return {
        statusCode: 200,
        body: JSON.stringify({en: splittedText[0], fi: splittedText[1]})
      }
    return {
      statusCode: 404,
      body: "File not found"
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate summary", details: error.message }),
    };
  }
};

export const main = middyfy(getSummaryMemoPdfHandler);