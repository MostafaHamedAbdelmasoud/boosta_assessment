import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const getAllReservationsSchema = joi
  .object({
    due_date: generalFields.date.optional(),
  })
  .required();