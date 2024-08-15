
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return  res.status(500).json({
        message: error?.message,
      });    
    });
  };
};
export const globalErrorHandling = (error, req, res, next) => {
  console.log(error);
  
  if (req.validationError) {
    return res.status(error?.cause || 400).json({
      message: error?.message,
      validationError: req?.validationError?.details.map((error) => {
        return { message: error?.message };
      }),
    });
  }
  return res.status(error?.cause || 500).json({ message: error?.message });
};
