import dotenv from "dotenv";
import MongoCrudExtended from "../daos/products/MongoCrudExtended.js";
import MongoCrudCartExtended from "../daos/cart/MongoCrudCartExtended.js";
import MongoUserExtended from "./users/MongoUserExtended.js";

dotenv.config();

let productsDao;
let cartDao;
let usersDao;

switch (process.env.DB_CONNECTION) {
  case "mongodb":
    productsDao = MongoCrudExtended;
    cartDao = MongoCrudCartExtended;
    usersDao = MongoUserExtended;
    break;
  default:
    break;
}

export { productsDao, cartDao, usersDao };
