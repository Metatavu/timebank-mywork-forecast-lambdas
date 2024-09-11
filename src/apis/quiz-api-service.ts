import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuidv4 } from "uuid";
import { QuestionnaireModel, Question } from "./schemas/questionnaire/questionnaire";

const tableName = process.env.QUESTIONNAIRE_TABLE;

/**
 * Database service for questionnaires
 */
class QuestionnaireService {

  /**
   * Constructor
   * @param docClient DynamoDB client
   */
  constructor(private readonly docClient: DocumentClient) {}

  /**
   * Creates a questionnaire 
   * 
   * @param questionnaire questionnaire 
   * @returns created questionnaire 
   */
  public createQuestionnaire = async (questionnaire: QuestionnaireModel): Promise<QuestionnaireModel> => {
    await this.docClient
      .put({
        TableName: tableName,
        Item: questionnaire
      })
      .promise();

    return questionnaire;
  }

  /**
   * Finds a single questionnaire
   * 
   * @param id questionnaire id
   * @returns questionnaire or null if not found
   */
  public findQuestionnaire = async (id: string): Promise<QuestionnaireModel | null> => {
    const result = await this.docClient
      .get({
        TableName: tableName,
        Key: {
          id: id
        },
      })
      .promise();

      return result.Item as QuestionnaireModel;
  }

  /**
   * Lists all questionnaires
   *
   * @returns list of questionnaires
   */
  public listQuestionnaires = async (): Promise<QuestionnaireModel[]> => {
    const result = await this.docClient
      .scan({
        TableName: tableName
      })
      .promise();

    return result.Items as QuestionnaireModel[];
  }
  /**
   * Updates a questionnaire
   *
   * @param software questionnaire to be updated
   * @returns updated questionnaire
   */
  public updateCuration = async (questionnaire: QuestionnaireModel): Promise<QuestionnaireModel> => {
    await this.docClient
      .put({
        TableName: tableName,
        Item: questionnaire
      })
      .promise();

      return questionnaire;
  }

  /**
   * Deletes a questionnaire
   *
   * @param id questionnaire id
   */
  public deleteQuestionnaire = async (id: string) => {
    return this.docClient
      .delete({
        TableName: tableName,
        Key: {
          id: id
        },
      })
      .promise();
  }

}

export default QuestionnaireService;