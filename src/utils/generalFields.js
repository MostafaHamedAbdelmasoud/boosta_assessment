import joi from "joi";

const generalFields = {
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
