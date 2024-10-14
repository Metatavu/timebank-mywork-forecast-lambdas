import createDynamoDBClient from "../client";
import QuestionnaireService from "./questionnaire-api-service";

export const questionnaireService = new QuestionnaireService(createDynamoDBClient());