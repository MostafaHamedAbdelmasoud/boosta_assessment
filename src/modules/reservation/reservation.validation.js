import { check } from 'express-validator';

export const getAllReservationsValidation = [
  check('due_date', 'due_date must be a date')
  .optional()
  .isISO8601()
  .bail()
  .custom((value, { req }) => {
    if (req.query.due_date && !value) {
      throw new Error('due_date must be a date');
    }
    return true;
  }),
check('from_due_date', 'from_due_date must be a date')
  .optional()
  .isISO8601()
  .bail()
  .custom((value, { req }) => {
    console.log('value: ', value, req.query.from_due_date);
    
    if (req.query.from_due_date && !value) {
      throw new Error('from_due_date must be a date');
      return false;
    }
    return true;
  }),
check('to_due_date', 'to_due_date must be a date')
  .optional()
  .isISO8601()
  .bail()
  .custom((value, { req }) => {
    if (req.query.to_due_date && !value) {
      throw new Error('to_due_date must be a date');
    }
    return true;
  }),
check('export', 'export must be a string')
  .optional()
  .isString()
  .bail()
  .custom((value, { req }) => {
    if (req.query.export && !value) {
      throw new Error('export must be a string');
    }
    return true;
  })
];