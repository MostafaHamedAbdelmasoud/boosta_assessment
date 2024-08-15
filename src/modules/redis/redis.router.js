import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import tokenSchema from "../../utils/tokenSchema.js";

import  * as redisController from "./controller/redis.controller.js";
import validation from "../../DB/middlewares/validation.js";
import auth from "../../DB/middlewares/auth.js";
const router = Router();
router
  .delete(
    "/delete",
    validation(tokenSchema, true),
    auth(),
    asyncHandler(redisController.deleteRedis)
  )
export default router;
