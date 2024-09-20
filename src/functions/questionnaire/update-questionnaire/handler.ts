import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { questionnaireService } from "src/database/services";
import QuestionnaireModel from "src/database/schemas/questionnaire/questionnaire";

/**
 * Lambda function to update a questionnaire
 *
 * @param event event
 */
const updateQuestionnaire: ValidatedEventAPIGatewayProxyEvent<typeof QuestionnaireModel> = async event => {
  const { pathParameters, body, } = event;
  const id = pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: "Bad request"
    };
  }

  const existingQuestionnaire = await questionnaireService.findQuestionnaire(id);
  if (!existingQuestionnaire) {
    return {
      statusCode: 404,
      body: `Questionnaire ${id} not found`
    };
  }

  const questionnaireUpdates: QuestionnaireModel = {
    ...existingQuestionnaire,
    ...body
  };

  try {
    const updatedQuestionnaire = await questionnaireService.updateQuestionnaire(questionnaireUpdates);
    return {
      statusCode: 200,
      body: JSON.stringify(updatedQuestionnaire)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error updating questionnaire record with id ${id}, ${error}`
    };
  }
};

export const main = middyfy(updateQuestionnaire);