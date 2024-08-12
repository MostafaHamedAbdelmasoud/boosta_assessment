import { sequelize } from './DB/connection.js'; // Ensure you have the correct path to your database configuration
import { borrowerModel } from "./DB/models/Borrower.model.js";
import { bookModel } from "./DB/models/Book.model.js";
import { borrowerBookModel } from "./DB/models/BorrowerBook.model.js";
import setupAssociations from './associations.js';

(async () => {
  try {
    
    //   setupAssociations();
    // Synchronize all models
    await sequelize.sync(
        // { force: true }
    );
    console.log('Database synced!');

    // // Optionally, create some initial data
    // const borrower = await borrowerModel.create({
    //   firstName: 'John',
    //   lastName: 'Doe'
    // });

    // const book = await BookModel.create({
    //   title: 'Sample Book',
    //   author: 'Author Name'
    // });

    // await BorrowerBookModel.create({
    //   borrowerId: borrower.id,
    //   bookId: book.id
    // });

    console.log('Initial data created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();