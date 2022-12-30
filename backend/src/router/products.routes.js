import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);

productsRouter.get("/:id", getProductById);

productsRouter.post("/", createProduct);

productsRouter.put("/:id", updateProduct);

productsRouter.delete("/:id", deleteProduct);

export default productsRouter;