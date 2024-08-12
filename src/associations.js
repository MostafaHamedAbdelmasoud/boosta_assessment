import { borrowerModel } from './DB/models/Borrower.model.js';
import { bookModel } from './DB/models/Book.model.js';
import { borrowerBookModel } from './DB/models/BorrowerBook.model.js';

export default function setupAssociations() {
  // Establish associations
  borrowerModel.belongsToMany(bookModel, { through: borrowerBookModel, foreignKey: 'borrower_id' });
  bookModel.belongsToMany(borrowerModel, { through: borrowerBookModel, foreignKey: 'book_id' });
}
