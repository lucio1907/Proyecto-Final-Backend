import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    products: [
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
          required: true,
        },
        quantity: {
          type: Number,
          trim: true
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default cartSchema;