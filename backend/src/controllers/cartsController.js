import path from "path";
import dotenv from "dotenv";
import { cartDao as Crud } from "../daos/index.js";
import { usersDao as CrudUsers } from "../daos/index.js";
import logConfiguration from "../helpers/log4jsConfig.js";

dotenv.config();

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const manager = new Crud();
const user = new CrudUsers();


const createCart = async (req, res) => {
  try {
    const newCart = await manager.create();

    res.json({ response: newCart});
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const getCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await manager.getOneCart(id);

    return res.status(cart.status).json({ response: cart });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const createProduct = async (req, res) => {
  const { id } = req.params;
  const productUpdated = req.body;

  try {
    const cart = await manager.createProduct(id, productUpdated);

    res.status(cart.status).json({ response: cart })
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const deleteCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await manager.deleteCart(id);
    return res.status(cart.status).json({ response: cart });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const deleteProductCart = async (req, res) => {
  const { id, id_prod } = req.params;

  try {
    const productDeleted = await manager.deleteProductCart(id, id_prod);

    return res.status(productDeleted.status).json({ response: productDeleted });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const buyProduct = async (req, res) => {
  const userID = req.session.passport.user;

  try {
    const currentUser = await user.findUserById(userID);
    const getCart = await manager.getOneCart(currentUser.cart);
    const cartID = getCart.cart._id;

    const cartUpdated = await manager.updateCart(cartID, currentUser);

    res.status(cartUpdated.status).json({ response: { buyStatus: cartUpdated.buyStatus, message: cartUpdated.message } });
  } catch (error) {
    logger.error(error);
  }
};

export {
  createCart,
  getCart,
  createProduct,
  deleteCart,
  deleteProductCart,
  buyProduct,
};
