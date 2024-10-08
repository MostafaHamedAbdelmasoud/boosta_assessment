import { sequelize } from "./DB/connection.js";
import { globalErrorHandling } from "./utils/asyncHandler.js";
import borrowerRouter from "./modules/borrower/borrower.router.js";
import bookRouter from "./modules/book/book.router.js";
import redisRouter from "./modules/redis/redis.router.js";
import reservationRouter from "./modules/reservation/reservation.router.js";
import setupAssociations from "./associations.js";
import {redisClient} from "./DB/redis.js";

async function Bootstrap(app, express) {

  app.use(globalErrorHandling);
  
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
    }

    redisClient.connect();

  setupAssociations();

  app.use("/redis", redisRouter);
  app.use("/borrowers", borrowerRouter);
  app.use("/books", bookRouter);
  app.use("/reservations", reservationRouter);
}
export default Bootstrap;
