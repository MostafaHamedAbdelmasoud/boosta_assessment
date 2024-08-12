import {sequelize} from "./DB/connection.js";
import { globalErrorHandling } from "./utils/asyncHandler.js";
import borrowerRouter from "./modules/borrower/borrower.router.js";
import bookRouter from "./modules/book/book.router.js";
import setupAssociations from "./associations.js";

// import blogRouter from "./modules/blog/blog.router.js";
// import clientRequestRouter from "./modules/clientRequest/clientRequest.router.js";
// import propertyRouter from "./modules/property/property.router.js";
// import developersRouter from "./modules/developer/developer.router.js";
// import projectRouter from "./modules/projects/project.router.js";
// import cityRouter from "./modules/city/city.router.js";
// import projectTypeRouter from "./modules/projectType/projectType.router.js";
async function Bootstrap(app, express) {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
    setupAssociations();

    await import('./migrate.js');

    

    
  app.use("/borrowers", borrowerRouter);
  app.use("/books", bookRouter);
  // app.use("/clientRequest", clientRequestRouter);
  // app.use("/property", propertyRouter);
  // app.use("/developer", developersRouter);
  // app.use("/project", projectRouter);
  // app.use("/city", cityRouter);
  // app.use("/projectType", projectTypeRouter);
  app.use(globalErrorHandling);
  
}
export default Bootstrap;
