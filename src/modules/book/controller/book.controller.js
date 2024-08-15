import { bookModel } from "../../../DB/models/Book.model.js";
import { redisClient } from "../../../DB/redis.js";
import { httpStatus } from "../../../utils/httpStatus.js";
import {
  deleteOneRecordFromRedis,
  getAllRecordsInRedis,
  setNewDataInRedis,
  updateOneRecordInRedis,
} from "../../../utils/redisHandler.js";

export const createBook = async (req, res, next) => {
  try {
    const newBook = await bookModel.create({
      title: req.body.title,
      author: req.body.author,
      ISBN: req.body.ISBN,
      available_quantity: req.body.available_quantity,
      shelf_location: req.body.shelf_location,
    });

    await setNewDataInRedis("books", newBook.dataValues);


    return res.status(httpStatus.OK.code).json({
      message: httpStatus.OK.message,
      id: newBook?.id,
    });
  } catch (error) {
    console.error("Error creating book: ", error);
    return res
    .status(httpStatus.INTERNAL_SERVER_ERROR.code)
    .json({ message: httpStatus.INTERNAL_SERVER_ERROR.message , error: error.errors });  }
};

export const updateBook = async (req, res, next) => {
  try {
    const bookExist = await bookModel.findOne({
      where: { id: req.params.id },
    });

    if (!bookExist) {
      return  res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }

     await bookModel.update(req.body, {
      where: { id: req.params.id }
    });
    
    const updatedBook = await bookModel.findOne({
      where: { id: req.params.id },
    });

    await updateOneRecordInRedis('books', req.params.id, updatedBook.dataValues);

    return res.status(httpStatus.OK.code).json({ message: httpStatus.OK.message, data: updatedBook });
  } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST.code)
        .json({ message: httpStatus.BAD_REQUEST.message , error: error.errors });
  }
};

export const getBooks = async (req, res, next) => {
  try {
    req.query.fields = [
      "id",
      "title",
      "author",
      "ISBN",
      "available_quantity",
      "shelf_location",
    ];
  
    const allCachedBooks = await getAllRecordsInRedis("books",bookModel);
    
    const findBooksByTitleAndAuthor = (params) => {
      const { id, title, author } = params;
      return allCachedBooks.filter((book) => {
        if (!book) {
          return false;
        }
        const matchesId = id ? book.id === id : true;
        const matchesTitle = title ? book.title.includes(title) : true;
        const matchesAuthor = author ? book.author.includes(author) : true;
        return matchesId && matchesTitle && matchesAuthor;
      });
    };

    return res.status(httpStatus.OK.code).json({
      message: httpStatus.OK.message,
      data: findBooksByTitleAndAuthor({
        id: req.query.id,
        title: req.query.title,
        author: req.query.author,
      }),
    });
  } catch (error) {
    console.error("Error getting books: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
      message: httpStatus.INTERNAL_SERVER_ERROR.message,
    });    
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const bookExist = await bookModel.findOne({
      where: { id: req.params.id },
    });

    if (!bookExist) {
      return res.status(httpStatus.NOT_FOUND.code).json({
        message: httpStatus.NOT_FOUND.message,
      });    
    }

    
    const result = await bookModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result === 0) {
      return res.status(httpStatus.BAD_REQUEST.code).json({
        message: httpStatus.BAD_REQUEST.message,
      });    
    } else {
      await deleteOneRecordFromRedis("books", req.params.id);
      return res.status(httpStatus.OK.code).json({
        message: httpStatus.OK.message,
        data: "Book deleted Successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting book: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
      message: httpStatus.INTERNAL_SERVER_ERROR.message,
    });    
  }
};
