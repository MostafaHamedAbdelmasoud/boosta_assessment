import { borrowerModel } from "../../../DB/models/Borrower.model.js";
import { generateToken } from "../../../utils/generateAndVerifyToken.js";
import { comparePassword } from "../../../utils/hashAndCompare.js";
import { httpStatus } from "../../../utils/httpStatus.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;


    const userExist = await borrowerModel.findOne({where:{ email: email }});

    if (!userExist) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }

    const passwordMatched = comparePassword({
      plainText: password,
      hashedValue: userExist.password,
    });
    if (!passwordMatched) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }

    const token = generateToken({
      payload: {
        id: userExist.id,
        email: userExist.email,
      },
      signature: process.env.JWT_TOKEN_SIGNATURE,
      expireIn: 60 * 60 * 24 * 15,
    });
    return res.status(httpStatus.OK.code).json({
      message: httpStatus.OK.message,
      token,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: httpStatus.INTERNAL_SERVER_ERROR.message, error: err });
  }
  return next();
};
