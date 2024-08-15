import joi from "joi";
import generalFields from "../../utils/generalFields.js";

  export const createBorrowerBookSchema = joi
  .object({
    due_date: generalFields.date.required(),
    book_id: generalFields.integer.required(),
  })
  .required();
  
