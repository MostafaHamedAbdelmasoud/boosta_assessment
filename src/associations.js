import { borrowerModel } from './DB/models/Borrower.model.js';
import { bookModel } from './DB/models/Book.model.js';
import { borrowerBookModel } from './DB/models/BorrowerBook.model.js';

export default function setupAssociations() {
borrowerModel.hasMany(borrowerBookModel, { as: 'borrowerBooks', foreignKey: 'borrower_id' });
borrowerBookModel.belongsTo(borrowerModel, {as:'borrower', foreignKey: 'borrower_id' });

bookModel.hasMany(borrowerBookModel, { as: 'borrowerBooks', foreignKey: 'book_id' });
borrowerBookModel.belongsTo(bookModel, { as: 'book', foreignKey: 'book_id' });

}
