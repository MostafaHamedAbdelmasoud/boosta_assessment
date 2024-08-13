import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as reservationValidation from "./reservation.validation.js";
import  * as reservationController from "./controller/reservation.controller.js";
import validation from "../../DB/middlewares/validation.js";
const router = Router();
router
  .get(
    "/",
    validation(reservationValidation.getAllReservationsSchema), 
    asyncHandler(reservationController.getReservations)
  )
export default router;
