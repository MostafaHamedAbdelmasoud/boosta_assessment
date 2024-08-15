import { check } from 'express-validator';

export const createBorrowerValidation = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('name').isString().withMessage('Name must be a string'),
  check('registered_date').isISO8601().withMessage('registered_date must be a date'),
  check('password').isString().withMessage('Password must be a string')
];

export const createBorrowerBookValidation = [
  check('book_id').isInt().withMessage('book_id must be an integer'),
  check('due_date').isISO8601().withMessage('due_date must be a date')
];

export const updateBorrowerValidation = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('name').isString().withMessage('Name must be a string'),
  check('registered_date').isISO8601().withMessage('registered_date must be a date')
];

export const loginValidation = [
  check('email').isEmail()
  .withMessage('Invalid email format')
  .notEmpty().withMessage('Email is required'),
  check('password')
  .notEmpty().withMessage('Password is required')
  .isString().withMessage('Password must be a string')
  .custom((value, { req }) => {
    if (!req.body.password && !value) {
      throw new Error('password is required');
    }
    return true;
  }),
];