import path from "path";
import dotenv from "dotenv";
import { cartDao as Crud } from "../daos/index.js";
import { productsDao as CrudProducts } from "../daos/index.js";
import { usersDao as CrudUsers } from "../daos/index.js";
import sendEmail from "../helpers/sendEmailOrder.js";
import sendMessageToUser from "../helpers/sendMessageToUser.js";
import logConfiguration from "../helpers/log4jsConfig.js";

dotenv.config();

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const manager = new Crud();
const products = new CrudProducts();
const user = new CrudUsers();

const showCartHTML = (req, res) => {
  res.sendFile(path.resolve("public/html/cart.html"));
};

const createCart = async (req, res) => {
  try {
    const newCart = await manager.create();
    res.json({ msg: "Cart Created!", newCart });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const getCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await manager.getOneCart(id);

    if (process.env.DB_CONNECTION === "firestore" && cart) {
      if (cart.status === 404) {
        const error = new Error("Cart not Found");
        return res.status(404).json({ msg: error.message });
      }

      return res.json({ cart: cart.response });
    }

    if (!cart) {
      const error = new Error("Cart not Found");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ cart: cart });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const createProduct = async (req, res) => {
  const { id } = req.params;
  const productUpdated = req.body;

  try {
    const cart = await manager.createProduct(id, productUpdated);

    if (process.env.DB_CONNECTION === "firestore") {
      if (!cart) {
        const error = new Error("Cannot update the product");
        return res.status(400).json({ msg: error.message });
      }
    }

    if (cart.modifiedCount === 0) {
      const error = new Error("Cannot update the product");
      return res.status(400).json({ msg: error.message });
    }

    // Restar stock y actualizar
    if (productUpdated.stock > 0) {
      logger.info(productUpdated);
      const newStock = productUpdated.stock - productUpdated.quantity;
      productUpdated.stock = newStock;
      await products.updateProduct(productUpdated._id, productUpdated);
      res.status(200).json({ msg: "Product added to cart" });
    }

    if (productUpdated.stock <= 0) {
      const error = new Error("No stock");
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const deleteCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await manager.deleteCart(id);

    if (cart.deletedCount === 0) {
      const error = new Error("Cart not Found");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ msg: `Cart with id "${id}" deleted!` });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const deleteProductCart = async (req, res) => {
  const { id, id_prod } = req.params;

  try {
    const productDeleted = await manager.deleteProductCart(id, id_prod);

    if (process.env.DB_CONNECTION === "firestore") {
      if (productDeleted.status === 404) {
        const error = new Error("Product not Found");
        return res.status(404).json({ msg: error.message });
      }

      return res.json({ productDeleted: productDeleted.products });
    }

    if (productDeleted === undefined) {
      const error = new Error("Product not Found");
      return res.status(404).json({ msg: error.message });
    }

    productDeleted.quantity += productDeleted.stock;
    await products.updateProduct(productDeleted._id, productDeleted);

    return res.json({
      msg: `Product with id ${productDeleted._id} has deleted!`,
    });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const buyProduct = async (req, res) => {
  const userID = req.session.passport.user;

  try {
    const currentUser = await user.findUserById(userID);
    const getCart = await manager.getOneCart(currentUser.cart);
    const cartID = getCart._id;

    const cartUpdated = await manager.updateCart(cartID);

    if (cartUpdated.products.length === 0) {
      const error = new Error("There are not products in your cart, please add one if you really want to make an order");
      return res.status(400).json({ message: error.message });
    }
  
    const order = getCart.products;
    
    sendEmail(currentUser, order);
    sendMessageToUser(currentUser);

    res.json({ status: "Buyed", message: "We'll send you an email with your order information" });
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
  showCartHTML,
  buyProduct,
};
