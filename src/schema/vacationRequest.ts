import { Type } from "@sinclair/typebox";
import {VacationRequestStatuses} from "@generated/client/model/vacationRequestStatuses";

/**
 * Schema for each individual status entry in a vacation request
 */
const vacationRequestStatusSchema = Type.Object({
  status: Type.Enum(VacationRequestStatuses),
  message: Type.String(),
  createdBy: Type.String(),
  updatedAt: Type.String()
})

/**
 * Schema for the vacation request table
 */
const vacationRequestSchema = Type.Object({
  draft: Type.Boolean(),
  startDate: Type.String(),
  endDate: Type.String(),
  days: Type.Number(),
  type: Type.String(),
  status: Type.Array(vacationRequestStatusSchema),
  message: Type.String(),
  createdBy: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export default vacationRequestSchema;
