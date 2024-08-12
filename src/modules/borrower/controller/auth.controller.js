import {borrowerModel} from "../../../DB/models/Borrower.model.js";
import {
  generateToken,
} from "../../../utils/generateAndVerifyToken.js";
import {
  comparePassword,
} from "../../../utils/hashAndCompare.js";


export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await borrowerModel.findOne({ email });
  if (!userExist) {
    return next(new Error("invalid email or password", { cause: 400 }));
  }
  
  const passwordMatched = comparePassword({
    plainText: password,
    hashedValue: userExist.password,
  });
  if (!passwordMatched) {
    return next(new Error("invalid email or password", { cause: 400 }));
  }
console.log(userExist.id, userExist.email);

  const token = generateToken({
    payload: {
      id: userExist.id,
      email: userExist.email,
    },
    signature: process.env.JWT_TOKEN_SIGNATURE,
    expireIn: 60 * 60 * 24 * 15,
  });
  const refToken = generateToken({
    payload: {
      id: userExist.id,
      email: userExist.email,
    },
    signature: process.env.JWT_TOKEN_SIGNATURE,
    expireIn: 60 * 60 * 24 * 30,
  });
  return res.status(200).json({
    message: "done",
    token,
    refToken,
  });
};


