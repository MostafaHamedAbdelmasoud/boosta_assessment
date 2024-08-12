import { Model, DataTypes } from 'sequelize';
import { borrowerModel } from './Borrower.model.js';
import { bookModel } from './Book.model.js';
import {sequelize} from '../connection.js'

// export const borrowerBookModel = sequelize.define('borrower_book', {
//   book_id: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   }, 

//   borrower_id: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   due_date: {
//     type: DataTypes.DATEONLY,
//     allowNull: false
//   },
// });


class BorrowerBookModel extends Model {}

BorrowerBookModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },  
  borrower_id: {
    type: DataTypes.INTEGER,
    references: {
      model: borrowerModel,
      key: 'id'
    }
  },
  book_id: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: bookModel,
      key: 'id'
    }
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'borrower_book',
  underscored: true 

});

export const borrowerBookModel = BorrowerBookModel;


