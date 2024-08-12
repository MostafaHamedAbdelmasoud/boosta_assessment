import { Model, DataTypes } from 'sequelize';
import {sequelize} from "../connection.js";


// export const borrowerModel = sequelize.define('borrowers', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   registered_date: {
//     type: DataTypes.DATEONLY,
//     allowNull: false
//   },
//   // subject: {
//   //   type: DataTypes.INTEGER,
//   // }
// });

class BorrowerModel extends Model {}

BorrowerModel.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull:false
  },
  registered_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'borrower',
  underscored: true ,
  tableName: 'borrowers',
  timestamps: true 
});

export const borrowerModel = BorrowerModel;


