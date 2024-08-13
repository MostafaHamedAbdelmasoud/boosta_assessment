import sequelize from "../../../DB/connection.js";
import { bookModel } from "../../../DB/models/Book.model.js";
import { borrowerModel } from "../../../DB/models/Borrower.model.js";
import { borrowerBookModel } from "../../../DB/models/BorrowerBook.model.js";
import { Sequelize } from "sequelize"; 

export const reserveBook = async (req, res, next) => {
  const t = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });
  try {
    req.body.borrower_id = req.user.id;
    const bookExist = await bookModel.findOne({
      where: { id: req.body.book_id },
    });
    if (!bookExist) {
      await t.rollback();
      return res.status(400).json({
        message: "book id is not found",
        error: "book does not exist",
      });
    }
    if (bookExist.available_quantity < 1) {
      await t.rollback();
      return next(
        new Error("no available stock for book: " + bookExist.title, {
          cause: 400,
        })
      );
    }

    const newBorrower = await borrowerBookModel.create(req.body, {
      transaction: t,
    });
    bookExist.available_quantity -= 1;
    await bookExist.save({ transaction: t });

    await t.commit();

    return res.status(200).json({
      message: "borrower created successfully",
      id: newBorrower?.id,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const getAllReservedBook = async (req, res, next) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });

  try {
    const allBorrowerBooks = await borrowerBookModel.findAll({
      where: { borrower_id: req.user.id },
    });

    if (!allBorrowerBooks) {
      await transaction.rollback();
      return next(new Error("borrower not found", { cause: 404 }));
    }
    await transaction.commit();

    return res.status(200).json({ message: "done", data: allBorrowerBooks });
  } catch (error) {
    await transaction.rollback();
    return res.status(409).json({ message: "error", error: error.message });
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
          model: borrowerBookModel,
          as: "borrowerBooks",
        },
      ],
    });

    if (!borrower) {
      await transaction.rollback();
      return res.status(404).json({ message: "Borrower not found" });
    }

    const { id: bookId } = req.params; // Assuming the book ID is passed as a URL parameter

    
    const bookExist = borrower.borrowerBooks.find(
      (borrowerBook) => borrowerBook.book_id === parseInt(bookId)
    );

    if (!bookExist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Book not found" });
    }

    await bookExist.destroy();
    await bookModel.increment("available_quantity", {
      by: 1,
      where: { id: bookExist.book_id },
      transaction,
    });
    await transaction.commit();

    return res
      .status(200)
      .json({ message: "BorrowerBook deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
