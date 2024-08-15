import { check } from 'express-validator';

export const createBorrowerBookValidation = [
  check('due_date').isISO8601().withMessage('due_date must be a valid date').notEmpty().withMessage('due_date is required'),
  check('book_id').isInt().withMessage('book_id must be an integer').notEmpty().withMessage('book_id is required')
];