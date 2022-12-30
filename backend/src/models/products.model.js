import mongoose from "mongoose";

const productsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    thumbnail: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      min: 0,
      max: 200,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default productsSchema;
