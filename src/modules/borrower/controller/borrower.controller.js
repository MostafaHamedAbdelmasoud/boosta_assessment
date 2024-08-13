import { Sequelize } from "sequelize";
import {sequelize} from "../../../DB/connection.js";
import { borrowerModel } from "../../../DB/models/Borrower.model.js";
import { generateToken } from "../../../utils/generateAndVerifyToken.js";
import { hashPassword } from "../../../utils/hashAndCompare.js";
import { borrowerBookModel } from "../../../DB/models/BorrowerBook.model.js";
import { bookModel } from "../../../DB/models/Book.model.js";

export const createBorrower = async (req, res, next) => {
  try {
    const userExist = await borrowerModel.findOne({
      where: { email: req.body.email },
    });
    if (userExist) {
      return next(new Error("email already exist", { cause: 409 }));
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

    return res.status(200).json({
      message: "borrower created successfully",
      id: newBorrower?.id,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.errors });
  }
};

export const updateBorrower = async (req, res, next) => {
  try {
    const borrowerExist = await borrowerModel.findOne({
      where: { id: req.params.id },
    });

    if (!borrowerExist) {
      return next(new Error("borrower not found", { cause: 404 }));
    }

    await borrowerModel.update(req.body, {
      where: { id: req.params.id },
    });

    const updatedBorrower = await borrowerModel.findOne({
      where: { id: req.params.id },
    });

    return res.status(200).json({ message: "done", data: updatedBorrower });
  } catch (error) {
    return res
      .status(409)
      .json({ message: "Unique constraint error", error: error.errors });
  }
};

export const getBorrowers = async (req, res, next) => {
  req.query.fields = ["id", "name", "email"];
  const limit = parseInt(req.params.limit, 10) || 10;
  const page = parseInt(req.params.page, 10) || 1;
  const offset = (page - 1) * limit;

  const borrowers = await borrowerModel.findAll({
    attributes: req.query.fields,
  });

  return res.status(200).json({
    message: "done",
    data: borrowers,
  });
};
export const me = async (req, res, next) => {

  return res.status(200).json({
    message: "done",
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
          model: borrowerBookModel,
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
      return next(new Error("borrower not found", { cause: 404 }));
    }
    // increase the available quantity of the borrowerBooks that was borrowed
    await borrowerExist.borrowerBooks.forEach(async (borrowerBook) => {
      await borrowerBook.book.increment("available_quantity", {
        by: 1,
        where: { id: borrowerBook.book_id },
      }, { transaction });
    });

    const result = await borrowerModel.destroy({
      where: {
        id: borrowerId,
      },
    });

    
    if (result === 0) {
      await transaction.rollback();
      return next(new Error("failed to delete borrower", { cause: 400 }));
    } else {
      await transaction.commit();
      return res.status(200).json({
        message: "done",
        data: "Borrower deleted Successfully",
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
  }
  return next();
};
