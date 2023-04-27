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
            const findUser = await this.collection.findOne({ username: newUserData.username });
            
            if (findUser) {
                return { status: 400 }
            } else {
                const newUser = await this.collection.create(newUserData);
                return newUser;
            }
        } catch (error) {
            console.error(error);
            if (error.code === 11000) {
                return { error: "This user already exists", status: 400 }
            }
        }
    }

    async findUser(user) {
        try {
            const userSearch = await this.collection.findOne({ email: user })
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

    async findByEmail(userEmail) {
        try {
            const searchEmail = await this.collection.findOne({ email: userEmail });
            return searchEmail
        } catch (error) {
            console.error(error);
        }
    }
}

export default MongoUser;