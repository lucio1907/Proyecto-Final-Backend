import express from 'express';
import { createCart, getCart, createProduct, deleteCart, deleteProductCart, buyProduct } from '../controllers/cartsController.js';

const cartRouter = express.Router(); 

cartRouter.get('/:id/productos', getCart);

cartRouter.get("/makeOrder", buyProduct);

cartRouter.post('/', createCart);

cartRouter.post('/:id/productos', createProduct);

cartRouter.delete('/:id', deleteCart);

cartRouter.delete('/:id/productos/:id_prod', deleteProductCart);

export default cartRouter;