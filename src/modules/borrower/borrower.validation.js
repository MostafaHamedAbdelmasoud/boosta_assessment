import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const createBorrowerSchema = joi
  .object({
    email: generalFields.email,
    name: generalFields.name,
    registered_date: generalFields.date,
    password: generalFields.text,
  })
  .required();
  
  export const createBorrowerBookSchema = joi
  .object({
    book_id: generalFields.integer,
    due_date: generalFields.date,
  })
  .required();
  export const updateBorrowerSchema = joi
  .object({
    id: joi.number().integer().min(1).required(),
    email: generalFields.email,
    name: generalFields.name,
    registered_date: generalFields.date,  
  })
  .required();
  export const deleteBorrowerSchema = joi
  .object({
    id:  joi.number().integer().min(1).required(),
  })
  .required();
  export const loginSchema = joi
  .object({
    email: generalFields.email,
    password: generalFields.text,
  })
  .required();