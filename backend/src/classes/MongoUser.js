import mongoose from "mongoose";
import dotenv from "dotenv";
import logConfiguration from "../helpers/log4jsConfig.js";

dotenv.config();

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

class MongoUser {
    constructor (collectionName, schema) {
        this.collection = mongoose.model(collectionName, schema);
    }

    async createUser(newUserData) {
        try {
            const newUser = await this.collection.create(newUserData);
            return newUser;
        } catch (error) {
            logger.error(error);
        }
    }

    async findUser(user) {
        try {
            const userSearch = await this.collection.findOne({ email: user }).select("-__v -createdAt -updatedAt");
            return userSearch;
        } catch (error) {
            logger.error(error);
        }
    }

    async findUserById(id) {
        try {
            const userSearch = await this.collection.findById(id).select("-__v -createdAt -updatedAt");
            return userSearch;
        } catch (error) {
            logger.error(error);
        }
    }
}

export default MongoUser;