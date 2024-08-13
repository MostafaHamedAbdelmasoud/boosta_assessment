import express from "express";
import Bootstrap from "./src/Bootstrap.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./config/.env") });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Bootstrap(app, express);



app.listen(process.env.PORT_KEY, () => {
  console.log(`server is running on port ${process.env.PORT_KEY}`);
});
