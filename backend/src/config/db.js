import mongoose from "mongoose";
import dotenv from "dotenv";
import logConfiguration from "../helpers/log4jsConfig.js";

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

dotenv.config();

mongoose.set('strictQuery', false);

const connectionDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${connection.connection.host}:${connection.connection.port}`;
    logger.log(`MongoDB connected in ${url} 🔥`);       
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

export default connectionDB;