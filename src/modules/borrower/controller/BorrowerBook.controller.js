import { borrowerModel } from "../../../DB/models/Borrower.model.js";
import { borrowerBookModel } from "../../../DB/models/BorrowerBook.model.js";


export const reserveBook = async (req, res, next) => {

  req.body.borrower_id = req.user.id;

  const newBorrower = borrowerBookModel
    .sync({ force: false })
    .then(() => {
      return borrowerBookModel.create(req.body);
    })
    .catch((error) => {
      console.log(error);
    });

  return res.status(200).json({
    message: "borrower created successfully",
    id: newBorrower?.id,
  });
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
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Unique constraint error", error: error.errors });
    }
    return next(error);
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

  // .filter()
  // .sort()
  // .fields()
  // .search();

  return res.status(200).json({
    message: "done",
    data: borrowers,
  });
};
export const deleteBorrower = async (req, res, next) => {
  const borrowerExist = await borrowerModel.findOne({
    where: { id: req.params.id },
  });
console.log('dsdsa',borrowerExist);

  if (!borrowerExist) {
    return next(new Error("borrower not found", { cause: 404 }));
  }

  const result = await borrowerModel.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (result === 0) {
    return next(new Error("failed to delete borrower", { cause: 400 }));
  } else {
    return res.status(200).json({
      message: "done",
      data: 'Borrower deleted Successfully',
    });
  }
};
