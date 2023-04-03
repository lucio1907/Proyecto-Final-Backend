import mongoose from "mongoose";
import logConfiguration from "../helpers/log4jsConfig.js";

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

class MongoCrudCart {
  constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema);
  }

  async create() {
    try {
      const newCart = await this.collection.create({});
      return newCart;
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
    }
  }

  async getOneCart(id) {
    try {
      const cart = await this.collection.findOne({ _id: id });
      return cart;
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
    }
  }

  async createProduct(id, doc) {
    try {
      const newProduct = await this.collection.updateOne(
        { _id: id },
        { $push: { products: { $each: [doc] } } }
      );
      return newProduct;
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
    }
  }

  async deleteCart(id) {
    try {
      const cartDeleted = await this.collection.deleteOne({ _id: id });
      return cartDeleted;
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
    }
  }

  async deleteProductCart(idCart, idProduct) {
    try {
      const itemToDelete = await this.collection.findOneAndUpdate({ _id: idCart }, { $pull: { products: { _id: idProduct } } });
      const productDeleted = itemToDelete.products.find(product => product.id === idProduct);
      return productDeleted;
    } catch (error) {
      logger.error(`❌ Error: ${error}`);
    }
  }

  async updateCart(idCart) {
    logger.log(idCart);
    try {
      const productsToDelete = await this.collection.findByIdAndUpdate(idCart, { $set: { products: [] } });
      return productsToDelete;
    } catch (error) {
      logger.error(error);
    }
  }
}

export default MongoCrudCart;
