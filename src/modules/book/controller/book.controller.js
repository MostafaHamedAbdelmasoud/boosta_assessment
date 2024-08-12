import { bookModel } from "../../../DB/models/Book.model.js";

import { Op } from "sequelize";

export const createBook = async (req, res, next) => {
  console.log("info", "createBook");
  console.log("body", req.body);

  const newBook = bookModel
    .sync({ force: false })
    .then(() => {
      return bookModel.create({
        title: req.body.title,
        author: req.body.author,
        ISBN: req.body.ISBN,
        available_quantity: req.body.available_quantity,
        shelf_location: req.body.shelf_location,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return res.status(200).json({
    message: "book created successfully",
    id: newBook?.id,
  });
};

export const updateBook = async (req, res, next) => {
  try {
    const bookExist = await bookModel.findOne({
      where: { id: req.params.id },
    });

    if (!bookExist) {
      return next(new Error("book not found", { cause: 404 }));
    }

    await bookModel.update(req.body, {
      where: { id: req.params.id },
    });

    const updatedBook = await bookModel.findOne({
      where: { id: req.params.id },
    });

    return res.status(200).json({ message: "done", data: updatedBook });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Unique constraint error", error: error.errors });
    }
    return next(error);
  }
};

export const getBooks = async (req, res, next) => {
  req.query.fields = ["id","title", "author", "ISBN", "available_quantity", "shelf_location"];
  
  const andConditions = [];

  if (req.query.author) {
    andConditions.push({
      author: {
        [Op.like]: `%${req.query.author}%`
      }
    });
  }
  
  if (req.query.ISBN) {
    andConditions.push({
      ISBN: {
        [Op.like]: `%${req.query.ISBN}%`
      }
    });
  }
  
  if (req.query.title) {
    andConditions.push({
      title: {
        [Op.like]: `%${req.query.title}%`
      }
    });
  }
  
  const books = await bookModel.findAll({
    attributes: req.query.fields,
    where:{
      [Op.and]: andConditions


    }
  });

  return res.status(200).json({
    message: "done",
    data: books,
  });
};
export const deleteBook = async (req, res, next) => {
  const bookExist = await bookModel.findOne({
    where: { id: req.params.id },
  });

  if (!bookExist) {
    return next(new Error("book not found", { cause: 404 }));
  }

  const result = await bookModel.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (result === 0) {
    return next(new Error("failed to delete book", { cause: 400 }));
  } else {
    return res.status(200).json({
      message: "done",
      data: "Book deleted Successfully",
    });
  }
};
