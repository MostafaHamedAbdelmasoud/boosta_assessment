import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import tokenSchema from "../../utils/tokenSchema.js";

import * as borrowerValidation from "./borrower.validation.js";
import * as borrowerBookValidation from "./borrowerBook.validation.js";
import * as borrowerController from "./controller/borrower.controller.js";
import * as borrowerBookController from "./controller/borrowerBook.controller.js";
import * as authController from "./controller/auth.controller.js";

import validation from "../../DB/middlewares/validation.js";
import auth from "../../DB/middlewares/auth.js";
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
  .get(
    "/me",
    validation(tokenSchema, true),
    auth(),
    asyncHandler(borrowerController.me)
  )
  .delete(
    "/",
    validation(tokenSchema, true),
    auth(),
    asyncHandler(borrowerController.deleteBorrower)
  )  
  .delete(
    "/books/:id",
    validation(tokenSchema, true),
    auth(),
    asyncHandler(borrowerBookController.deleteReservedBook)
  )
  .post(
    "/books",
    validation(tokenSchema, true),
    auth(),
    validation(borrowerBookValidation.createBorrowerBookSchema),
    asyncHandler(borrowerBookController.reserveBook)
  )
  .get(
    "/books",
    validation(tokenSchema, true),
    auth(),
    asyncHandler(borrowerBookController.getAllReservedBook)
  )
  .post(
    "/login",
    validation(borrowerValidation.loginSchema),
    asyncHandler(authController.login)
  );
export default router;
