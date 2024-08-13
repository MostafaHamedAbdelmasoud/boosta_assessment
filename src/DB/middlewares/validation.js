
const validation = (schema,containToken) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    
    if (req.headers.authorization && containToken) {
      data = { authorization: req.headers.authorization };
    }

    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult?.error) {
      req.validationError = validationResult?.error;
      return next(new Error("catch validation error", { cause: 400 }));
    }
    next();
  };
};
export default validation;
