import joi from "joi";
import generalFields from "../../utils/generalFields.js";

  export const createBorrowerBookSchema = joi
  .object({
    book_id: generalFields.integer,
    due_date: generalFields.date,
  })
  .required();
