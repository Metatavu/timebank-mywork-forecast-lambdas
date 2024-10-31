import { APIGatewayProxyHandler } from "aws-lambda";
import { GoogleDriveService } from "src/database/services/google-api-service";
import { middyfy } from "src/libs/lambda";

const drive = new GoogleDriveService();

/**
 * Converts all docs within main root folder to pdf format
 */
const convertToPdf = async () => { 
  const files = await drive.getBaseFolderFiles();
  for (const file of files) {
    await drive.uploadDocsContentAsPdf(file);
  }
};

/**
 * Lambda for uploading PDFs.
 * 
 * @returns JSON response
 */
export const uploadGoogleFileHandler: APIGatewayProxyHandler = async () => {
  try {
    const filePdf = await convertToPdf();
    console.log('Files uploaded successfully:', filePdf);

    return {
      statusCode: 200,
      body: JSON.stringify(filePdf)
    };

  } catch (error) {
    console.error("Error upoading pdf:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload pdf.', details: error.message }),
    };
  }
};

export const main = middyfy(uploadGoogleFileHandler);