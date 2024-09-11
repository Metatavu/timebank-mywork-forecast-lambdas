
export interface QuestionnaireModel {
    id?: string;
    name: string;
    description: string;
    questions: Question[];
}

export interface Question { 
    id?: string;
    question: string;
    type: string;
    options: Array<boolean>;
}
