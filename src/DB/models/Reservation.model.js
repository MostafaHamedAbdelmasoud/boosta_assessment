import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../connection.js'


class reservationModel extends Model {}

reservationModel.init({
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
  modelName: 'reservation',
  underscored: true 

});

export { reservationModel};


