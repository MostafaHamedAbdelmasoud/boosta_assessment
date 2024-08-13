import { sequelize } from "./DB/connection.js";
import { globalErrorHandling } from "./utils/asyncHandler.js";
import borrowerRouter from "./modules/borrower/borrower.router.js";
import bookRouter from "./modules/book/book.router.js";
import reservationRouter from "./modules/reservation/reservation.router.js";
import setupAssociations from "./associations.js";

async function Bootstrap(app, express) {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  await import("./migrate.js");

  setupAssociations();

  app.use("/borrowers", borrowerRouter);
  app.use("/books", bookRouter);
  app.use("/reservations", reservationRouter);
  app.use(globalErrorHandling);
}
export default Bootstrap;
