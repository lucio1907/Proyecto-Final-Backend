import mongoose from "mongoose";
import logConfiguration from "../helpers/log4jsConfig.js";
import { productsDao as CrudProducts } from "../daos/index.js";
import sendEmail from "../helpers/sendEmailOrder.js";
import sendMessageToUser from "../helpers/sendMessageToUser.js";

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

class MongoCrudCart {
  constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema);
  }

  async create() {
    try {
      const newCart = await this.collection.create({});
      return { msg: "Cart created!", newCart, status: 200 };
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
      return { error: error.message, status: 500 };
    }
  }

  async getOneCart(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid cart ID: ${id}`);
        return { msg: error.message, status: 400 };
      }

      const cart = await this.collection.findOne({ _id: id }).select("-__v -createdAt -updatedAt");

      if (!cart || cart === undefined) {
        const error = new Error("Cart not Found");
        return { msg: error.message, status: 404 };
      }

      return { cart, status: 200 };
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
      return { error: error.message, status: 500 }
    }
  }

  async createProduct(id, productUpdated) {
    const products = new CrudProducts();
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid cart ID: ${id}`);
        return { msg: error.message, status: 400 };
      }


      if (productUpdated.stock <= 0) {
        const error = new Error("No stock");
        return { message: error.message, status: 400 };
      }

      if (parseInt(productUpdated.stock) < parseInt(productUpdated.quantity)) {
        const error = new Error("Quantity cannot be greater than stock");
        return { error: error.message, status: 400 };
      }

      const newProduct = await this.collection.updateOne({ _id: id }, { $push: { products: { $each: [productUpdated] } } });

      // Restar stock y actualizar
      if (productUpdated.stock > 1) {
        logger.info(productUpdated);
        const newStock = parseInt(productUpdated.stock) - parseInt(productUpdated.quantity);
        productUpdated.stock = newStock;
        await products.update(productUpdated._id, productUpdated);
        return { msg: "Product added to cart", productUpdated, status: 200 };
      }

      if (newProduct.modifiedCount === 0) {
        const error = new Error("Cannot update the product");
        return { msg: error.message, status: 400 };
      }

      return { newProduct, status: 200 };
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
      return { error: error.message, status: 500 };
    }
  }
  

  async deleteCart(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid cart ID: ${id}`);
        return { msg: error.message, status: 400 };
      }

      const cartDeleted = await this.collection.deleteOne({ _id: id });

      if (cartDeleted.deletedCount === 0) {
        const error = new Error("Cart not Found");
        return { msg: error.message, status: 404 };
      }

      return { msg: `Cart with id "${id}" deleted!`, status: 200 };
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
      return { error: error.message, status: 500 }
    }
  }

  // TODO: Borra producto con el id de producto indicado al carrito indicado y actualiza el stock
  async deleteProductCart(idCart, idProduct) {
    const products = new CrudProducts();
    try {
      if (!mongoose.Types.ObjectId.isValid(idCart)) {
        const error = new Error(`Invalid cart ID: ${idCart}`);
        return { msg: error.message, status: 400 };
      }

      const itemToDelete = await this.collection.findOneAndUpdate({ _id: idCart }, { $pull: { products: { _id: idProduct } } });
      const productDeleted = itemToDelete.products.find(product => product.id === idProduct);

      if (productDeleted === undefined) {
        const error = new Error("Product not Found");
        return { msg: error.message, status: 404 };
      }
  
      productDeleted.quantity += productDeleted.stock;
      await products.update(productDeleted._id, productDeleted);
      return { productDeleted, status: 200 };
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
      return { error: error.message, status: 500 };
    }
  }

  async updateCart(idCart, currentUser) {
    try {
      if (!mongoose.Types.ObjectId.isValid(idCart)) {
        const error = new Error(`Invalid cart ID: ${idCart}`);
        return { msg: error.message, status: 400 };
      }


      const getCart = await this.getOneCart(idCart);
    
      const order = getCart.cart.products;

      if (order.length === 0) {
        const error = new Error("There are not products in your cart, please add one if you really want to make an order");
        return { message: error.message, status: 400 };
      } else {
        sendEmail(currentUser, order);
        sendMessageToUser(currentUser);
      }

      const productsToDelete = await this.collection.findByIdAndUpdate(idCart, { $set: { products: [] } });
    
      return { productsToDelete, status: 200, buyStatus: "Buyed", message: "We'll send you an email with your order information" };
    } catch (error) {
      logger.error(error);
      return { error: error.message, status: 500 }
    }
  }
}

export default MongoCrudCart;
