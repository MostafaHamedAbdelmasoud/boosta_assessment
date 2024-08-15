import {sequelize} from "../../../DB/connection.js";
import { bookModel } from "../../../DB/models/Book.model.js";
import { borrowerModel } from "../../../DB/models/Borrower.model.js";
import { reservationModel } from "../../../DB/models/Reservation.model.js";
import { Sequelize } from "sequelize"; 
import {  setNewDataInRedis, updateOneRecordInRedis } from "../../../utils/redisHandler.js";
import { httpStatus } from "../../../utils/httpStatus.js";
import { redisClient } from "../../../DB/redis.js";

export const reserveBook = async (req, res, next) => {
  const t = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });
  try {
    req.body.borrower_id = req.user.id;
    const bookExist = await bookModel.findByPk( req.body.book_id, { transaction: t });

    if (!bookExist) {
      await t.rollback();
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }
    if (bookExist.available_quantity < 1) {
      await t.rollback();
      return res.status(httpStatus.BAD_REQUEST.code).json({
        message: httpStatus.BAD_REQUEST.message,
      });    
    }
    
    const newBorrower = await reservationModel.create(req.body, {
      transaction: t,
    });
    bookExist.update({ available_quantity: bookExist.available_quantity - 1 }, { transaction: t });

    console.log("bookExist before the commut ", bookExist.dataValues);
    await setNewDataInRedis("reservations", newBorrower.dataValues);
    await updateOneRecordInRedis("books",bookExist.id, bookExist.dataValues);
    await t.commit();

    console.log("bookExist after the commit ", await bookModel.findByPk(bookExist.id).dataValues);

    return res.status(httpStatus.CREATED.code).json({
      message: httpStatus.CREATED.message,
      id: newBorrower?.id,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: httpStatus.INTERNAL_SERVER_ERROR.message , error: error.message });
  }
};

export const getAllReservedBook = async (req, res, next) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });

  try {
    const allBorrowerBooks = await reservationModel.findAll({
      where: { borrower_id: req.user.id },
    });

    if (!allBorrowerBooks) {
      await transaction.rollback();
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }
    await transaction.commit();
    return res.status(httpStatus.OK.code).json({ message: httpStatus.OK.message, data: allBorrowerBooks });

  } catch (error) {

    return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
       message: httpStatus.INTERNAL_SERVER_ERROR.message, error: error.message });
  }
};

export const deleteReservedBook = async (req, res, next) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });

  try {
    const borrowerModelId = req.user.id;

    const borrower = await borrowerModel.findByPk(borrowerModelId, {
      include: [
        {
          model: reservationModel,
          as: "reservations",
        },
      ],
    });

      
    if (!borrower) {
      
      await transaction.rollback();
      returnres.status(httpStatus.NOT_FOUND.code).json({
        message: 'borrower '+httpStatus.NOT_FOUND.message
      });    
    }

    const { id: bookId } = req.params; 
    
    
    const reservationExist = borrower.reservations.find(
      (reservation) => reservation.book_id === parseInt(bookId)
    );

    if (!reservationExist) {
      await transaction.rollback();
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }

    const borrowedBook = await bookModel.findByPk(reservationExist.book_id);
    
    borrowedBook.update({ available_quantity: +borrowedBook.available_quantity+1 }, { transaction });
    
    await reservationExist.destroy(transaction);
    await updateOneRecordInRedis("books",borrowedBook.id, borrowedBook.dataValues);
    await deleteTheReservationFromRedis("reservations", reservationExist.book_id,req.user.id);
    await transaction.commit();
    console.log("borrowedBook after the commit ", await bookModel.findByPk(borrowedBook.id).dataValues);


    return res
      .status(httpStatus.OK.code)
      .json({ message: httpStatus.OK.message });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
       message: httpStatus.INTERNAL_SERVER_ERROR.message, error: error.message });
  }
};

export const deleteTheReservationFromRedis = async (key, bookId,borrowerId) => {
  try {

    const records = await redisClient.get(key);
    if (!records) {
      console.log(`No records found for key ${key}`);
      return;
    }

    const parsedData = JSON.parse(records);

    const updatedData = parsedData.filter((record) => {
      if (!record) {
        return false;
      }
      return record.book_id != bookId && record.borrower_id != borrowerId;
    });

    await redisClient.set(key, JSON.stringify(updatedData));

  } catch (error) {
    console.error(`Error removing value from Redis for key ${key}:`, error);
    throw error;
  }
};