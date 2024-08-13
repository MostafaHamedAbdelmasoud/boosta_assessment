import sequelize from "../../../DB/connection.js";
import { borrowerBookModel } from "../../../DB/models/BorrowerBook.model.js";
import { Op, Sequelize } from "sequelize";

export const getReservations = async (req, res, next) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });

  try {
    req.query.fields = ["id", "book_id", "borrower_id", "due_date"];

    const reservations = await borrowerBookModel.findAll({
      attributes: req.query.fields,
      where: req.query.due_date
        ? { due_date: { [Op.lte]: req.query.due_date } }
        : {},
    });
    await transaction.commit();

    return res.status(200).json({
      message: "done",
      data: reservations,
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
  }
  return next();
};
