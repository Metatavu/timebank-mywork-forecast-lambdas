import createDynamoDBClient from "../client";
import QuestionnaireService from "./quiz-api-service";

export const questionnaireService = new QuestionnaireService(createDynamoDBClient());