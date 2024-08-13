import joi from "joi";
import generalFields from "../../utils/generalFields.js";
const checkBookExists = async (value) => {
  const book = await bookModel.findByPk(value);
  if (!book) {
    // throw new Error('Book ID does not exist');
    return helpers.message('Book ID does not exist');

  }
  return value;
};
  export const createBorrowerBookSchema = joi
  .object({
    due_date: generalFields.date.required(),
    book_id: generalFields.integer.required(),
  })
  .required();
  
