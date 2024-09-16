export interface QuestionnaireModel {
  id: number;
  title: string;
  description: string;
  options: Question[];
  tags?: string[];
  passedUsers?: number[];
  passScore: number;
}

export interface Question {
  question: string;
  options: Option[];
}

export interface Option {
  label: string;
  value: boolean;
}
