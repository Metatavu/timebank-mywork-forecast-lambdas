/**
 * DynamoDB schema for Questionnaire
 */

export interface QuestionnaireModel {
  id: number;
  title: string;
  description: string;
  options: Question[];
  tags?: string[];
  passedUsers?: number[];
  passScore: number;
}

/**
 * DynamoDB schema for Question
 */

export interface Question {
  question: string;
  options: Option[];
}

/**
 * DynamoDB schema for Option
 */

export interface Option {
  label: string;
  value: boolean;
}