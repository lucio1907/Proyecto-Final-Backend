import path from "path";
import dotenv from "dotenv";
import userUnauthorized from "../helpers/unauthorizedFunction.js";
import { productsDao as Crud } from "../daos/index.js";
import logConfiguration from "../helpers/log4jsConfig.js";

dotenv.config();

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const manager = new Crud();

const isAdmin = true;

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await manager.getAll();
    return res.status(allProducts.status).json({ response: allProducts });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const getProduct = await manager.getOneElement(id);
    return res.status(getProduct.status).json({ response: getProduct });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const createProduct = async (req, res) => {
  try {
    // Chequear el admin
    if (isAdmin) {
      const newProduct = await manager.create(req.body);
      return res.status(newProduct.status).json({ response: newProduct });
    } else {
      userUnauthorized(res);
    }
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const doc = req.body;

  try {
    const productUpdated = await manager.update(id, doc);
    return res.status(productUpdated.status).json({ response: productUpdated });
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Chequear el admin
    if (isAdmin) {
      const productDeleted = await manager.delete(id);
      return res.status(productDeleted.status).json({ response: productDeleted });
    } else {
      userUnauthorized(res);
    }
  } catch (error) {
    logger.error(`❌ Error: ${error}`);
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
