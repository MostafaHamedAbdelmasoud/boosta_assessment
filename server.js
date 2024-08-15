import express from "express";
import Bootstrap from "./src/Bootstrap.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./.env") });
const app = express();

const startServer = async () => {
  try {
    await import("./src/migrate.js");

  app.listen(process.env.PORT_KEY, () => {
    console.log(`server is running on port ${process.env.PORT_KEY}`);
  });
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
startServer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Bootstrap(app, express);

export {app, startServer};



