import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const createBookSchema = joi
  .object({
    title: generalFields.text,
    author: generalFields.text,
    ISBN: generalFields.text,
    available_quantity: generalFields.integer,
    shelf_location: generalFields.text,
  })
  .required();
  export const updateBookSchema = joi
  .object({
    id: joi.number().integer().min(1).required(),
    title: generalFields.text.optional(),
    author: generalFields.text.optional(),
    ISBN: generalFields.text.optional(),
    available_quantity: generalFields.integer.optional(),
    shelf_location: generalFields.text.optional(),
  });
  export const deleteBookSchema = joi
  .object({
    id:  joi.number().integer().min(1).required()
  });

