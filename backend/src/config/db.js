import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set('strictQuery', false);

const connectionDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB connected in ${url} 🔥`);       
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectionDB;