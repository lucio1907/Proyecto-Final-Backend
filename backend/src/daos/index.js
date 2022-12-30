import dotenv from 'dotenv';
import MongoCrudExtended from "../daos/products/MongoCrudExtended.js";
import MongoCrudCartExtended from "../daos/cart/MongoCrudCartExtended.js";

dotenv.config();

let productsDao;
let cartDao;

switch (process.env.DB_CONNECTION) {
    case "mongodb":
        productsDao = MongoCrudExtended;
        cartDao = MongoCrudCartExtended;
        break;

    default:
        break;
}

export { productsDao, cartDao }