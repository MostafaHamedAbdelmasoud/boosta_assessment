import { Model, DataTypes } from 'sequelize';
import {sequelize} from "../connection.js";


// export const bookModel = sequelize.define('books', {
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   author: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   ISBN: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   available_quantity: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   shelf_location: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// });



class BookModel extends Model {}

BookModel.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ISBN: {
    type: DataTypes.STRING,
    allowNull: false
  },
  available_quantity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shelf_location: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'book',
  underscored: true 
});

export const bookModel = BookModel;
