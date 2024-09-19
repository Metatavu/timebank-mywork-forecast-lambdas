import { Type } from "@sinclair/typebox";
/**
 * Schema for the Questionnaire table
 */

const questionnaireSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  options: Type.Array(
    Type.Object({
      question: Type.String(),
      options: Type.Array(
        Type.Object({
          label: Type.String(),
          value: Type.Boolean(),
        }),
      ),
    }),
  ),
  tags: Type.Optional(Type.Array(Type.String())),
  passedUsers: Type.Optional(Type.Array(Type.Number())),
  passScore: Type.Number(),
});

export default questionnaireSchema;
