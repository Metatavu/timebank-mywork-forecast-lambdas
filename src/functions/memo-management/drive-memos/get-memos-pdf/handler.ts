import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DateTime } from "luxon";
import { PdfFile } from "src/database/schemas/google";
import { getFiles, getFilesContentPdf } from "src/database/services/google-api-service";
import { middyfy } from "src/libs/lambda";

/**
 * Gets content of PDF memos as buffer object
 * 
 * @param date DateTime for files filtering
 * @returns Array of PDF
 */
const listMemoPdf = async (date: DateTime): Promise<PdfFile[]> => {
  const files = (await getFiles(date.year.toString(), date.monthLong))
  .filter(file => !file.name.startsWith("translated_"));
  const pdfContent = await getFilesContentPdf(files);
  return pdfContent;
}

/**
 * Lambda for retriving content of memos PDF
 * 
 * @param event event
 */
const listMemoPdfHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const {queryStringParameters} = event;

  if (!queryStringParameters?.date) {
    return  {
      statusCode: 400,
      body: "Missing parameters"
    };
  }
  try {
  const pdfFilesContent = await listMemoPdf(DateTime.fromISO(queryStringParameters.date));
    return {
      statusCode: 200,
      body: JSON.stringify(pdfFilesContent)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve PDF content", details: error.message }),
    };
  }
};

export const main = middyfy(listMemoPdfHandler);