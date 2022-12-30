import mongoose from "mongoose";

class MongoCrud {
    constructor (collectionName, schema) {
        this.collection = mongoose.model(collectionName, schema);
    }

    async getAll() {
        try {
            const allProducts = this.collection.find().select("-__v -createdAt -updatedAt");
            return allProducts;
        } catch (error) {
            console.error(`❌ Error: ${error}`);
        }
    }

    async getOneElement(id) {
        try {
            const singularProduct = await this.collection.findOne({ "_id": id }).select("-__v -createdAt -updatedAt");;
            return singularProduct;
        } catch (error) {
            console.error(`❌ Error: ${error}`);
        }
    }

    async create(products) {
        try {
            const newProducts = await this.collection.create(products);
            return newProducts;
        } catch (error) {
            console.error(`❌ Error: ${error}`);
        }
    }

    async saveManyProducts(products) {
        try {
            const newProducts = await this.collection.insertMany(products);
            return newProducts;
        } catch (error) {
            console.error(`❌ Error: ${error}`);
        }
    }

    async update(id, doc) {
        try {
            const productUpdated = await this.collection.findByIdAndUpdate(id, doc)
            console.log(productUpdated);
            return productUpdated;
        } catch (error) {
            console.error(`❌ Error: ${error}`);
        }
    }

    async delete(id) {
        try {
            const productDeleted = await this.collection.deleteOne({"_id": id});
            return productDeleted;
        } catch (error) {
            console.error(`❌ Error: ${error}`);
        }
    }
}

export default MongoCrud;