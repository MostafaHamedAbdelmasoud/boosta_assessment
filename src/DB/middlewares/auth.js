import { verifyToken } from "../../utils/generateAndVerifyToken.js";
import { borrowerModel } from "../models/Borrower.model.js";

const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      
      if (!authorization) {
        return next(new Error("please login first", { cause: 400 }));
      }
      if (!authorization.startsWith(process.env.TOKEN_BEARER_KEY)) {
        return next(new Error("invalid bearer key", { cause: 400 }));
      }
      const token = authorization?.split(process.env.TOKEN_BEARER_KEY)[1];

      if (!token) {
        return next(new Error("invalid token", { cause: 400 }));
      }

      const decodedToken = verifyToken({
        token,
        signature: process.env.JWT_TOKEN_SIGNATURE,
      });

      if (!decodedToken?.id) {
        return next(new Error("invalid token payload", { cause: 400 }));
      }
      const borrower = await borrowerModel.findOne({
        where: { id: decodedToken?.id },
      });
      if (!borrower) {
        return next(new Error("please sign up first", { cause: 404 }));
      }

      req.user = borrower;
    } catch (err) {
      console.log(err);
    }
    return next();
  };
};
export default auth;
