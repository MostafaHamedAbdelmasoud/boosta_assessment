import { Sequelize } from "sequelize";
import {sequelize} from "../../../DB/connection.js";
import { borrowerModel } from "../../../DB/models/Borrower.model.js";
import { generateToken } from "../../../utils/generateAndVerifyToken.js";
import { hashPassword } from "../../../utils/hashAndCompare.js";
import { reservationModel } from "../../../DB/models/Reservation.model.js";
import { bookModel } from "../../../DB/models/Book.model.js";
import { httpStatus } from "../../../utils/httpStatus.js";
import { getAllRecordsInRedis, setNewDataInRedis, updateOneRecordInRedis } from "../../../utils/redisHandler.js";

export const createBorrower = async (req, res, next) => {
  try {
    const userExist = await borrowerModel.findOne({
      where: { email: req.body.email },
    });
    if (userExist) {
      return res.status(httpStatus.ALREADY_EXISTS.code).json({
        message: httpStatus.ALREADY_EXISTS.message,
      });    
    }

    req.body.password = hashPassword({
      plainText: req.body.password,
    });

    const newBorrower = await borrowerModel.create(req.body);
    const token = generateToken({
      payload: {
        id: newBorrower.id,
        email: newBorrower.email,
      },
      signature: process.env.JWT_TOKEN_SIGNATURE,
      expireIn: 60 * 60 * 24 * 15,
    });
    await setNewDataInRedis("borrowers", newBorrower.dataValues);

    return res.status(httpStatus.CREATED.code).json({
      message: httpStatus.CREATED.message,
      id: newBorrower?.id,
      token,
    });
  } catch (error) {
    console.error("Error creating borrower: ", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: httpStatus.INTERNAL_SERVER_ERROR.message, error: error.errors });
  }
};

export const updateBorrower = async (req, res, next) => {
  try {
    const borrowerExist = await borrowerModel.findOne({
      where: { id: req.params.id },
    });

    if (!borrowerExist) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }

    await borrowerModel.update(req.body, {
      where: { id: req.params.id },
    });

    const updatedBorrower = await borrowerModel.findOne({
      where: { id: req.params.id },
    });
    await updateOneRecordInRedis('borrowers', req.params.id, updatedBorrower.dataValues);

    return res.status(httpStatus.OK.code).json({ message: httpStatus.OK.message, data: updatedBorrower });
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST.code)
      .json({ message: httpStatus.BAD_REQUEST.message, error: error.errors });
  }
};

export const getBorrowers = async (req, res, next) => {
  req.query.fields = ["id", "name", "email"];
  
  const allCachedBorrowers = await getAllRecordsInRedis("borrowers",borrowerModel);

  return res.status(httpStatus.OK.code).json({
    message: httpStatus.OK.message,
    data: allCachedBorrowers,
  });
};
export const me = async (req, res, next) => {

  return res.status(httpStatus.OK.code).json({
    message: httpStatus.OK.message,
    data: req.user,
  });
};

export const deleteBorrower = async (req, res, next) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });
  try {
    const borrowerId = req.user.id;
    const borrowerExist = await borrowerModel.findOne({
      where: { id: borrowerId },
      include: [
        {
          model: reservationModel,
          as: "borrowerBooks",
          include: [
            {
              model: bookModel,
              as: "book",
            },
          ],
        },
      ],
    });

    if (!borrowerExist) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }
    // increase the available quantity of the borrowerBooks that was borrowed
    await borrowerExist.borrowerBooks.forEach(async (borrowerBook) => {
      await borrowerBook.book.increment("available_quantity", {
        by: 1,
        where: { id: borrowerBook.book_id },
      }, { transaction });
      await updateOneRecordInRedis("books", borrowerBook.book.book_id, borrowerBook.book.dataValues);

    });

    const result = await borrowerModel.destroy({
      where: {
        id: borrowerId,
      },
    });

    
    if (result === 0) {
      await transaction.rollback();
      return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message,
      });    
    } else {
      await deleteOneRecordFromRedis("borrowers", req.params.id);

      await transaction.commit();
      return res.status(httpStatus.CREATED.code).json({
        message: httpStatus.CREATED.message,
        data: "Borrower deleted Successfully",
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
  }
  return next();
};
