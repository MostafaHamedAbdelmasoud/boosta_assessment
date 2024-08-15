import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import tokenSchema from "../../utils/tokenSchema.js";

import * as borrowerValidation from "./borrower.validation.js";
import * as reservationValidation from "./reservation.validation.js";
import * as borrowerController from "./controller/borrower.controller.js";
import * as borrowerReservation from "./controller/borrowerReservation.controller.js";
import * as authController from "./controller/auth.controller.js";

import validation from "../../DB/middlewares/validation.js";
import auth from "../../DB/middlewares/auth.js";
const router = Router();
router
  .post(
    "/",
    borrowerValidation.createBorrowerBookValidation,
    asyncHandler(borrowerController.createBorrower)
  )
  .put(
    "/:id",
    borrowerValidation.updateBorrowerValidation,
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
    asyncHandler(borrowerReservation.deleteReservedBook)
  )
  .post(
    "/books",
    validation(tokenSchema, true),
    auth(),
    reservationValidation.createBorrowerBookValidation,
    asyncHandler(borrowerReservation.reserveBook)
  )
  .get(
    "/books",
    validation(tokenSchema, true),
    auth(),
    asyncHandler(borrowerReservation.getAllReservedBook)
  )
  .post(
    "/login",
    borrowerValidation.loginValidation,
    asyncHandler(authController.login)
  );
export default router;
