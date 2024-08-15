import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";

import * as bookValidation from "./book.validation.js";
import  * as bookController from "./controller/book.controller.js";
import validation from "../../DB/middlewares/validation.js";

const router = Router();
router
  .post(
    "/",
    bookValidation.createBookSchema,
    asyncHandler(bookController.createBook)
  )
  .put(
    "/:id",
    bookValidation.updateBookSchema,
    asyncHandler(bookController.updateBook)
  )
  .get("/", asyncHandler(bookController.getBooks))
  .delete(
    "/:id",
    asyncHandler(bookController.deleteBook)
  );
export default router;
