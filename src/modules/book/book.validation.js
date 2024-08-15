import { check, validationResult } from "express-validator";

export const createBookSchema = [
  check("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Title is required and must be a string"),
  check("author")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Author is required and must be a string"),
  check("ISBN")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("ISBN is required and must be a string"),
  check("available_quantity")
    .isInt({ min: 0 })
    .withMessage("Available quantity must be a non-negative integer"),
  check("shelf_location")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Shelf location is required and must be a string"),
];

export const updateBookSchema = [
  check("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  check("title")
    .optional()
    .isString()
    .trim()
    .withMessage("Title must be a string"),
  check("author")
    .optional()
    .isString()
    .trim()
    .withMessage("Author must be a string"),
  check("ISBN")
    .optional()
    .isString()
    .trim()
    .withMessage("ISBN must be a string"),
  check("available_quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Available quantity must be a non-negative integer"),
  check("shelf_location")
    .optional()
    .isString()
    .trim()
    .withMessage("Shelf location must be a string"),
];
