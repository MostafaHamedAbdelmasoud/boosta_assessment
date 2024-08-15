import { verifyToken } from "../../utils/generateAndVerifyToken.js";
import { httpStatus } from "../../utils/httpStatus.js";
import { borrowerModel } from "../models/Borrower.model.js";

const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      
      if (!authorization) {
        return res.status(httpStatus.BAD_REQUEST.code).json({
          message: 'please login first!',
        });    
      }
      if (!authorization.startsWith(process.env.TOKEN_BEARER_KEY)) {
        return res.status(httpStatus.BAD_REQUEST.code).json({
          message: 'invalid token',
        });    
      }
      const token = authorization?.split(process.env.TOKEN_BEARER_KEY)[1];

      if (!token) {
        return res.status(httpStatus.BAD_REQUEST.code).json({
          message: 'invalid token',
        });    
      }

      const decodedToken = verifyToken({
        token,
        signature: process.env.JWT_TOKEN_SIGNATURE,
      });

      if (!decodedToken?.id) {
        return res.status(httpStatus.BAD_REQUEST.code).json({
          message: 'invalid token payload',
        });    
      }
      const borrower = await borrowerModel.findOne({
        where: { id: decodedToken?.id },
      });
      if (!borrower) {
        return  res.status(httpStatus.NOT_FOUND.code).json({
          message: httpStatus.NOT_FOUND.message,
        });    
      }

      req.user = borrower;
    } catch (err) {
      console.log(err);
    }
    return next();
  };
};
export default auth;
