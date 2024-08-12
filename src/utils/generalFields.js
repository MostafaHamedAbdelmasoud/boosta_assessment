import joi from "joi";
// import { validateId } from "../DB/middlewares/validation.js";

const generalFields = {
  // id: joi.string().custom(validateId).required(),
  // _id: joi.string().custom(validateId),
  name: joi.string().trim(),
  text: joi.string(),
  integer: joi.number().integer(),
  email: joi
    .string()
    .email({ tlds: { allow: ["net", "com"] } })
    .required()
    .messages({
      "string.empty": "email can't be empty",
      "any.required": "email is required field",
    }),
  date: joi.date().required()
};
export default generalFields;
