import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import tokenSchema from "../../utils/tokenSchema.js";

import * as borrowerValidation from "./borrower.validation.js";
import * as borrowerBookValidation from "./borrowerBook.validation.js";
import * as borrowerController from "./controller/borrower.controller.js";
import * as BorrowerBookController from "./controller/BorrowerBook.controller.js";
import * as authController from "./controller/auth.controller.js";
// import uploadFiles, {
//   uploadFilesValidation,
// } from "../../utils/cloudinaryMulter.js";
import validation from "../../DB/middlewares/validation.js";
import auth from "../../DB/middlewares/auth.js";
// import userEndPointsRoles from "./user.endPoinetsRoles.js";
const router = Router();
router
  .post(
    "/",
    validation(borrowerValidation.createBorrowerSchema),
    asyncHandler(borrowerController.createBorrower)
  )
  .put(
    "/:id",
    validation(borrowerValidation.updateBorrowerSchema),
    asyncHandler(borrowerController.updateBorrower)
  )
  .get("/", asyncHandler(borrowerController.getBorrowers))
  .delete(
    "/:id",
    validation(borrowerValidation.deleteBorrowerSchema),
    asyncHandler(borrowerController.deleteBorrower)
  )
  .post(
    "/book",
    validation(tokenSchema, true),
    auth(),
    validation(borrowerBookValidation.createBorrowerBookSchema),
    asyncHandler(BorrowerBookController.reserveBook)
  )
  .post(
    "/login",
    validation(borrowerValidation.loginSchema),
    asyncHandler(authController.login)
  )
export default router;
