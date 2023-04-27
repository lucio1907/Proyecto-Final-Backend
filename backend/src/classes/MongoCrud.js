import mongoose from "mongoose";

class MongoCrud {
  constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema);
  }

  async getAll() {
    try {
      const allProducts = await this.collection.find().select("-__v -createdAt -updatedAt");

      if (allProducts.length === 0) {
        const error = new Error("There are no products yet");
        return { msg: error.message, status: 404 };
      }

      return { allProducts, status: 200 };
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async getOneElement(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid product ID: ${id}`);
        return { msg: error.message, status: 400 };
      }

      const product = await this.collection.findOne({ _id: id }).select("-__v -createdAt -updatedAt");
      return { product, status: 200 };
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      return { msg: "Product not found", status: 404 };
    }
  }

  async create(products) {
    try {
      const newProducts = await this.collection.create(products);

      return { newProducts, status: 200 };
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      return { msg: "Something went wrong", status: 400 };
    }
  }

  async update(id, doc) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid product ID: ${id}`);
        return { msg: error.message, status: 400 };
      }

      const productToUpdate = await this.collection.findByIdAndUpdate(id, doc).select("-__v -createdAt -updatedAt -_id");
      return { productToUpdate, productUpdated: doc, status: 200 };
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      return { msg: "Product not found", status: 404 };
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid product ID: ${id}`);
        return { msg: error.message, status: 400 };
      }


      const productToDelete = await this.getOneElement(id);
      const productDeleted = await this.collection.deleteOne({ _id: id });

      if (productDeleted.deletedCount === 0) {
        const error = new Error("The product doesn't exist");
        return { msg: error.message, status: 400 };
      }

      if (!productToDelete) {
        const error = new Error("The product doesn't exists");
        return { msg: error.message, status: 400 };
      }

      return { productDeleted: productToDelete.product, status: 200 };
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }
}

export default MongoCrud;
