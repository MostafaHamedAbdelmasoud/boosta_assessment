import { borrowerModel } from './DB/models/Borrower.model.js';
import { bookModel } from './DB/models/Book.model.js';
import { reservationModel } from './DB/models/Reservation.model.js';

export default function setupAssociations() {
borrowerModel.hasMany(reservationModel, { as: 'reservations', foreignKey: 'borrower_id' });
reservationModel.belongsTo(borrowerModel, {as:'borrower', foreignKey: 'borrower_id' });

bookModel.hasMany(reservationModel, { as: 'reservations', foreignKey: 'book_id' });
reservationModel.belongsTo(bookModel, { as: 'book', foreignKey: 'book_id' });

}
