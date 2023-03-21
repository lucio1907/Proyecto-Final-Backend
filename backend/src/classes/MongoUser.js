import mongoose from "mongoose";

class MongoUser {
    constructor (collectionName, schema) {
        this.collection = mongoose.model(collectionName, schema);
    }

    async createUser(newUserData) {
        try {
            const newUser = await this.collection.create(newUserData);
            return newUser;
        } catch (error) {
            console.error(error);
        }
    }

    async findUser(user) {
        try {
            const userSearch = await this.collection.findOne(user).select("-__v -createdAt -updatedAt");
            return userSearch;
        } catch (error) {
            console.error(error);
        }
    }

    async findUserById(id) {
        try {
            const userSearch = await this.collection.findById(id).select("-__v -createdAt -updatedAt");
            return userSearch;
        } catch (error) {
            console.error(error);
        }
    }
}

export default MongoUser;