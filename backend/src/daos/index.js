import dotenv from "dotenv";
import MongoCrudExtended from "../daos/products/MongoCrudExtended.js";
import MongoCrudCartExtended from "../daos/cart/MongoCrudCartExtended.js";
import FirestoreProductsCrudExtended from "../daos/products/FirestoreProductsCrudExtended.js";
import FirestoreCartCrudExtended from "../daos/cart/FirestoreCartCrudExtended.js";

dotenv.config();

let productsDao;
let cartDao;

switch (process.env.DB_CONNECTION) {
  case "mongodb":
    productsDao = MongoCrudExtended;
    cartDao = MongoCrudCartExtended;
    break;

  case "firestore":
    productsDao = FirestoreProductsCrudExtended;
    cartDao = FirestoreCartCrudExtended;
    break;

  default:
    break;
}

export { productsDao, cartDao };
