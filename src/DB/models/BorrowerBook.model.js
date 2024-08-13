import { Model, DataTypes } from 'sequelize';
import { borrowerModel } from './Borrower.model.js';
import {sequelize} from '../connection.js'


class BorrowerBookModel extends Model {}

BorrowerBookModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },  
  borrower_id: {
    type: DataTypes.INTEGER,
  },
  book_id: {
    type: DataTypes.INTEGER,
    unique: true,
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


