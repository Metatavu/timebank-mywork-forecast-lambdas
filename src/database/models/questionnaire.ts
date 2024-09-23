/**
 * DynamoDB model for Questionnaire
 */
interface QuestionnaireModel {
  id: string;
  title: string;
  description: string;
  options: Question[];
  tags?: string[];
  passedUsers?: number[];
  passScore: number;
}

/**
 * DynamoDB model for Question
 */
interface Question {
  question: string;
  options: Option[];
}

/**
 * DynamoDB model for Option
 */
interface Option {
  label: string;
  value: boolean;
}

export default QuestionnaireModel;