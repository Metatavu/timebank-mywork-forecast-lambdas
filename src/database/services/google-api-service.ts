import { drive_v3, google } from 'googleapis';
import { File, PdfFile } from '../schemas/google';
import { Readable } from 'stream';
import {streamToBuffer, getYearAndMonth} from "../../libs/file-utils";
import fetch from "node-fetch";

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const openaiKey = process.env.OPENAI_API_KEY;
const folderId = process.env.GOOGLE_MANAGEMENT_MINUTES_FOLDER_ID;

/**
 * Google authentication service
 *
 * @returns Google Authentication 
 */
const getGoogleAuth = async () => {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
    keyId: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID!,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/cloud-translation"
    ],
  });
}

/**
 * Gets Google Authentication and Drive service
 *
 * @returns Google Drive 
 */
const getDriveService = async () => {
  const auth = await getGoogleAuth();
  return google.drive({ version: 'v3', auth });
}

/**
 * Gets Google Authentication and Google Documents service
 *
 * @returns Google Documents
 */
const getDocsService = async () => {
  const auth = await getGoogleAuth(); 
  return google.docs({ version: 'v1', auth });
}

/**
 * Gets Google Drive folder ID for a specified year and month, organized under a main root folder
 *
 * @param year year
 * @param month month
 * @returns folder ID of month folder
 */
export const getFolderId = async (year: string, month: string): Promise<string> => {
  const drive = await getDriveService();

  const yearFolderId = (await drive.files.list({
    q: `'${folderId}' in parents and name = '${year}' and mimeType = 'application/vnd.google-apps.folder'`,
    fields: 'files(id)'
  })).data?.files[0]?.id;
  if (!yearFolderId) return "";

  const monthFolderId = (await drive.files.list({
    q: `'${yearFolderId}' in parents and name = '${month}' and mimeType = 'application/vnd.google-apps.folder'`,
    fields: 'files(id)'
  })).data?.files[0]?.id;

  return monthFolderId;
}

/**
 * Retrieves a list of files from the base folder
 * 
 * @returns array of File objects
 */ 
export const getBaseFolderFiles = async (): Promise<File[]> => {
  const drive = await getDriveService();

  const files: File[] = (await drive.files.list({
    q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.document'`,
    fields: 'files(id, name, mimeType)'
  })).data?.files;

  return files;
}

/**
 * Retrieves a list of files from a specified year and month folder
 *
 * @param year year
 * @param month month
 * @param mimeType type of file, PDF format by default
 * @returns array of File objects
 */
export const getFiles = async (year?: string, month?: string, mimeType: string = "application/pdf"): Promise<File[]> => {
  const drive = await getDriveService();

  if (!year && !month) {
    return await getBaseFolderFiles();
  }
  const monthFolderId = await getFolderId(year, month);

  if (!monthFolderId) return [];
  const files: File[] = (await drive.files.list({
    q: `'${monthFolderId}' in parents and mimeType = '${mimeType}'`,
    fields: 'files(id, name, mimeType)'
  })).data?.files;

  return files;
}

/**
 * Retrieves metadata for a specified file ID
 * 
 * @param id file ID
 * @returns file's metadata
 */
export const getFile = async (id: string): Promise<File | undefined> => {
  const drive = await getDriveService();

  const file = (await drive.files.get({
    fileId: id,
    fields: 'id, name, mimeType',
  }))?.data;
  
  return file;
}

/**
 * Gets text content of a specified file in plain text format
 * 
 * @param file File metadata
 * @returns file's content
 */
export const getFileText = async (file: File): Promise<string> => {
  const drive = await getDriveService();

  const text = await drive.files.export({
    fileId: file.id,
    mimeType: 'text/plain'
  }).then(res => res.data);
  return text as string;
}

/**
 * Generates memo summary with chatGPT service 
 *
 * @param file File metadata
 * @returns summary text as string
 */
export const generateSummary = async (file: File): Promise<string> => {
  const drive = await getDriveService();
  try {
    const text = await drive.files.export({
      fileId: file.id,
      mimeType: 'text/plain'
    }).then(res => res.data);

    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    };
    const summurizeInEn = `Generate a summary for the following document in English: ${text}`;
    const summurizeInFi =  `Generate a summary for the following document in Finnish: ${text}`;
    const body = (content) => JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "user", content: content},
      ],
      max_tokens: 200
    });

    const englishSummary = (await (await fetch(url, {
      method: 'POST',
      headers: headers,
      body : body(summurizeInEn)
    })).json()).choices[0].message.content;

    const finnishSummary = (await (await fetch(url, {
      method: 'POST',
      headers: headers,
      body : body(summurizeInFi)
    })).json()).choices[0].message.content;
    return englishSummary + "\n\n" + finnishSummary;
  } catch (error) {
    console.error('Error generating description:', error);
    throw new Error('Failed to generate description');
  }
}

/**
 * Creates a new Google Docs document with a summary text, placed in a specified folder
 * 
 * @param text summary text
 * @param folderId folder ID
 * @param file File metadata
 */
export const createDocxSummary = async (text: string, folderId: string, file: File) => {
  const docs = await getDocsService();
  const drive = await getDriveService();
  const docResponse = await docs.documents.create({
    requestBody: {
      title: `summary_${file.name}`,
    },
  });
  const documentId = docResponse.data.documentId;
  
  await drive.files.update({
    fileId: documentId,
    addParents: folderId,   
    removeParents: "",      
    fields: "id, parents",
  });

  await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 }, 
            text: text,
          },
        },
      ],
    },
  });
}

/**
 * Retrieves the binary content of a single PDF file 
 * 
 * @param file File object
 * @param usedDrive Drive Instance
 * @returns PDF file objects
 */
export const getFileContentPdf = async (file: File, usedDrive?: drive_v3.Drive): Promise<PdfFile> => {
  const drive = usedDrive || await getDriveService();
  try {
    const response = await drive.files.get({
      fileId: file.id,
      alt: 'media',
    },
    { responseType: 'stream'}
    )
    if (!response) {
      throw new Error(`Failed to fetch file content: ${response.status} - ${response.statusText}`);
    }
    const pdfBuffer = await streamToBuffer(response.data);
    return {
      id: file.id,
      name: file.name,
      content: pdfBuffer
    }
  } catch (error) {
    console.error('Error loading the PDF:', error);
    throw new Error('Failed to load PDF');
  } 
}

/**
 * Fetches and exports binary file content of multiple PDF files
 *
 * @param files array of File objects
 * @returns array of PDF file objects
 */
export const getFilesContentPdf = async (files: File[]): Promise<PdfFile[]> => {
  const drive = await getDriveService();
  const fileContentPdf = await Promise.all(
    files.map(async (file: File) => {
      const fileContent = await getFileContentPdf(file, drive)
      return fileContent;
    }
  ));
  return fileContentPdf;
}

/**
 * Checks if a folder (year or month) exists under a specified parent folder, and creates it if necessary
 * 
 * @param drive Drive Instance
 * @param folderName folder name
 * @param parentFolderId parent folder ID where the folder should be located/created
 * @returns ID of folders
 */
const getOrCreateFolder = async (drive: any, folderName: string, parentFolderId: string): Promise<string> => {
  const response = await drive.files.list({
    q: `'${parentFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    fields: 'files(id, name)',
  });
  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id;
  } else {
    const folder = await drive.files.create({
      requestBody: { name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [parentFolderId] }
    });
    return folder.data.id;
  }
}

/**
 * Checks PDF file existence
 * 
 * @param drive Drive Instance
 * @param folderId folder ID
 * @param fileName file name
 * @returns object of file IDs
 */
const checkExistingFile = async (drive: any, folderId: string, fileName: string): Promise<{ id: string } | null> => {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and name='${fileName}' and mimeType='application/pdf'`,
    fields: 'files(id, name)'
  });
  const files = response.data.files;

  return files && files.length > 0
    ? { id: files[0].id }
    : null;
}

/**
 * Fetches the content of a specified file
 * 
 * @param fileId file ID
 * @param mimeType type of file
 * @param responseType type of response
 * @returns file content
 */
const fetchFileContent = async (fileId: string, mimeType: string, responseType: 'stream' | 'text' = 'stream'): Promise<any> => {
  const drive = await getDriveService();
  const response = await drive.files.export({ fileId, mimeType }, { responseType });
  if (!response) throw new Error(`Failed to fetch file content: ${response.status} - ${response.statusText}`);
  return response.data
}

/**
 * Uploads content as PDF and organizes files by year and month in folders.
 * 
 * @param file File object
 */
export const uploadDocsContentAsPdf = async (file: File): Promise<any> => {
  const drive = await getDriveService();
  try {
    const [year, monthName] = getYearAndMonth(file.name);

    const yearFolderId =  await getOrCreateFolder(drive, year, folderId);;
    const monthFolderId = await getOrCreateFolder(drive, monthName, yearFolderId);;
    const existingFile = await checkExistingFile(drive, monthFolderId, `${file.name}.pdf`);

    const fileContent = await fetchFileContent(file.id, 'application/pdf', 'stream');
    if (existingFile) {
      await drive.files.update({
        fileId: existingFile.id,
        requestBody: { name: `${file.name}.pdf`, mimeType: 'application/pdf' },
        media: { mimeType: 'application/pdf', body: fileContent },
        });
    } else {
      await drive.files.create({
        requestBody: { name: `${file.name}.pdf`, mimeType: 'application/pdf', parents: [monthFolderId] },
        media: { mimeType: 'application/pdf', body: fileContent }
      });
    }
  } catch (error) {
    throw new Error(`Failed to process file ${file.name}`);
  }
}
  
/**
 * Translates PDF content to Fi/En
 * 
 * @param pdfFile PDF file object
 * @returns PDF with translated content
 */
export const getTranslatedPdf = async (pdfFile: PdfFile): Promise<PdfFile> => {
  const accessToken = (await (await getGoogleAuth()).authorize()).access_token;

  const content = pdfFile.content.toString('base64');
  const translatedFileName = `translated_${pdfFile.name}`;
  const url = `https://translation.googleapis.com/v3/projects/${projectId}/locations/us-central1:translateDocument`

  const detectFileLanguage = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      target_language_code: "fi",
      document_input_config: {
        mimeType: "application/pdf",
        content: content
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const result = await detectFileLanguage.json();
  const detectedLanguage = result.documentTranslation.detectedLanguageCode;
  if (detectedLanguage == 'en') {
    const translatedContent = result.documentTranslation.byteStreamOutputs[0];
    const bufferData = Buffer.from(translatedContent, 'base64')
    return {
      id: "",
      name: translatedFileName,
      content: bufferData
    }
  }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(
    {
      source_language_code: "fi",
      target_language_code: "en",
      document_input_config: {
        mimeType: "application/pdf",
        content: content
      }
    }),
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
      }
  });
  const responseJs = await response.json()
  const translatedContent = responseJs.documentTranslation.byteStreamOutputs[0];
  const bufferData = Buffer.from(translatedContent, 'base64')
  return {
    id: "",
    name: translatedFileName,
    content: bufferData
  }
}

/**
 * Creates a new PDF file from binary content and stores it in a specified folder
 * 
 * @param pdfFile PDF file object
 * @param folderId folder ID
 * @returns ID of files
 */
export const createPdfFile = async (pdfFile: PdfFile, folderId: string) => {
  const drive = await getDriveService();
  const response = await drive.files.create({
    requestBody: {
      name: pdfFile.name,
      mimeType: 'application/pdf',
      parents: [folderId]
    },
    media: {
      mimeType: 'application/pdf',
      body: Readable.from(pdfFile.content)
    }
  });
  return response.data.id;
}