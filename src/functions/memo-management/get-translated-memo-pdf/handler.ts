import { APIGatewayProxyHandler } from "aws-lambda";
import { DateTime } from "luxon";
import { PdfFile } from "src/database/schemas/google";
import { GoogleDriveService } from "src/database/services/google-api-service";
import { middyfy } from "src/libs/lambda";

const drive = new GoogleDriveService();

/**
 * Gets content of translated pdf memos as buffer object
 * 
 * @param date DateTime for files filtering
 * @param fileId Id of file to translate
 * @returns translated pdf buffer object
 */
const getTranslatedMemoPdf = async (date: DateTime, fileId: string) => {
  try {
    const file = await drive.getFile(fileId);
    if (!file) return;
    const filesInFolder = await drive.getFiles(date.year.toString(), date.monthLong);
    const translatedFile = filesInFolder.find(fileInFolder => fileInFolder.name == `translated_${file.name}`);
    if (translatedFile) {
      const translatedPdf = await drive.getFileContentPdf(translatedFile);
      return translatedPdf;
    }
    const filePdf = await drive.getFileContentPdf(file);
    const translatedPdf = await drive.getTranslatedPdf(filePdf);
    const folderIdToSaveFile = await drive.getFolderId(date.year.toString(), date.monthLong);
    const idOfCreatedFile = await drive.createPdfFile(translatedPdf, folderIdToSaveFile);
    return {...translatedPdf, id: idOfCreatedFile};
  } catch (error) {
    console.error(error);
  }
}

/**
 * Lambda for retriving translated content of memos pdf
 * 
 * @param event event
 */
export const getTranslatedMemoPdfHandler: APIGatewayProxyHandler = async (event: any) => {
  const {queryStringParameters} = event;

  if (!queryStringParameters || !queryStringParameters?.date && !queryStringParameters?.fileId) {
    return  {
      statusCode: 400,
      body: 'Missing parameters'
    };
  }
  
  const translatedFilePdf = await getTranslatedMemoPdf(DateTime.fromISO(queryStringParameters.date), queryStringParameters.fileId);
  
  if (translatedFilePdf) 
    return {
      statusCode: 200,
      body: JSON.stringify(translatedFilePdf)
    }
  return {
    statusCode: 404,
    body: 'File not found'
  }
};

export const main = middyfy(getTranslatedMemoPdfHandler);