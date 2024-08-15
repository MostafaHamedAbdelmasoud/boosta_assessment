import { httpStatus } from "../../utils/httpStatus.js";

const validation = (schema,containToken) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    
    if (req.headers.authorization && containToken) {
      data = { authorization: req.headers.authorization };
    }

    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult?.error) {
      req.validatilogonError = validationResult?.error;
      return  res.status(httpStatus.BAD_REQUEST.code).json({
        message: 'Catch validation error',
      });    
    }
    next();
  };
};
export default validation;
