
import { httpStatus } from "../../../utils/httpStatus.js";
import { deleteAllRedis } from "../../../utils/redisHandler.js";

export const deleteRedis = async (req, res, next) => {
  try{
      await deleteAllRedis();
      return res
      .status(httpStatus.CREATED.code)
      .json({ message: httpStatus.CREATED.message});
  }
  catch(error){
     return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: httpStatus.INTERNAL_SERVER_ERROR.message, error: error.errors });
  }
};