import { S3 } from "aws-sdk"

/**
 * Set of S3 utilities
 */
namespace S3Utils {

  /**
   * Loads JSON from S3
   * 
   * @param s3 S3 client
   * @param key object key
   * @returns object data as JSON or null if not found
   */
  export const loadJson = async <T>(s3: S3, bucket: string, key: string): Promise<T | null> => {
    try {
      const object = await s3.getObject({
        Bucket: bucket,
        Key: key
      }).promise();

      const body = object.Body;
      if (!body) {
        return null;
      }

      return JSON.parse(body.toString());
    } catch (e: any) {
      if (e.code === "NoSuchKey") {
        return null;
      }

      throw e;
    }
  }

  /**
   * Saves data as JSON to S3
   * 
   * @param s3 s3 client
   * @param key object key
   * @param data data to be saved as JSON
   */
  export const saveJson = async <T>(s3: S3, bucket: string, key: string, data: T): Promise<void> => {
    await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(data)
    }).promise();
  }
}

export default S3Utils;