import { DateTime } from "luxon";
import { Readable } from "stream";

/**
 * Converts readable stream to Buffer
 * 
 * @param stream  stream content to convert into Buffer
 * @returns Buffer object
 */
export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Extracts month and year from file name
 * 
 * @param fileName file name
 * @returns parsed date
 */
export const  getYearAndMonth = (fileName: string): [string, string] => {
  const dateMatch = fileName.match(/\b(\d{2})\.(\d{2})\.(\d{4})\b$/);
  const year = dateMatch ? dateMatch[3] : new Date().getFullYear().toString();
  const month = dateMatch ? dateMatch[2] : new Date().getMonth().toString().padStart(2, '0');
  const monthName = DateTime.fromFormat(`${year}-${month}`, 'yyyy-MM').toFormat('MMMM');
  return [year, monthName];
}