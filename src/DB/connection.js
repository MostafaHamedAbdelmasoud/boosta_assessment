import { Sequelize} from "sequelize";
export const sequelize = new Sequelize("bosta", "root", "Hamed&1234", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: "3306",

});