import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";

import * as bookValidation from "./book.validation.js";
import  * as bookController from "./controller/book.controller.js";
import validation from "../../DB/middlewares/validation.js";
const router = Router();
router
  .post(
    "/",
    validation(bookValidation.createBookSchema),
    asyncHandler(bookController.createBook)
  )
  .put(
    "/:id",
    validation(bookValidation.updateBookSchema),
    asyncHandler(bookController.updateBook)
  )
  .get("/", asyncHandler(bookController.getBooks))
  .delete(
    "/:id",
    validation(bookValidation.deleteBookSchema),
    asyncHandler(bookController.deleteBook)
  );
export default router;
