import type VacationRequestModel from "@database/models/vacationRequest";
import type { DocumentClient } from "aws-sdk/clients/dynamodb";

const TABLE_NAME = "VacationRequests";

/**
 * Database service for vacation requests
 */
class VacationRequestService {
  /**
   * Constructor
   * @param docClient DynamoDB client
   */
  constructor(private readonly docClient: DocumentClient) {}

  /**
   * Creates a vacation request
   *
   * @param vacationRequest vacation request
   * @returns created vacationRequest
   */
  public createVacationRequest = async (
    vacationRequest: VacationRequestModel
  ): Promise<VacationRequestModel> => {
    await this.docClient
      .put({
        TableName: TABLE_NAME,
        Item: vacationRequest
      })
      .promise();

    return vacationRequest;
  };

  /**
   * Finds a single vacation request
   *
   * @param id vacation request id
   * @returns vacation request or null if not found
   */
  public findVacationRequest = async (id: string): Promise<VacationRequestModel | null> => {
    const result = await this.docClient
      .get({
        TableName: TABLE_NAME,
        Key: {
          id: id
        }
      })
      .promise();

    return result.Item as VacationRequestModel;
  };

  /**
   * Lists all vacation requests
   *
   * @returns list of vacation requests
   */
  public listVacationRequests = async (userId?: string): Promise<VacationRequestModel[]> => {
    const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: TABLE_NAME
    };

    if (userId) {
      scanParams.FilterExpression = "userId = :userId";
      scanParams.ExpressionAttributeValues = {
        ":userId": userId
      };
    }

    const result = await this.docClient.scan(scanParams).promise();
    return result.Items as VacationRequestModel[];
  };

  /**
   * Updates a vacation request
   *
   * @param vacationRequest vacation request to be updated
   * @returns updated vacation request
   */
  public updateVacationRequest = async (
    vacationRequest: VacationRequestModel
  ): Promise<VacationRequestModel> => {
    await this.docClient
      .put({
        TableName: TABLE_NAME,
        Item: vacationRequest
      })
      .promise();

    return vacationRequest;
  };

  /**
   * Deletes a vacation request
   *
   * @param id vacation request id
   */
  public deleteVacationRequest = async (id: string) => {
    return this.docClient
      .delete({
        TableName: TABLE_NAME,
        Key: {
          id: id
        }
      })
      .promise();
  };
}

export default VacationRequestService;
