import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        min: 4,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        min: 4,
        required: true
    },
    address: {
        type: String,
        trim: true,
    },
    age: {
        type: Number,
        trim: true,
        required: true
    },
    phone: {
        type: Number,
        trim: true,
        unique: true,
        min: 4
    },
    avatar: {
        type: String,
        trim: true,
    },
    cart: {
        type: String,
        trim: true,
        required: true
    }
},
{
    timestamps: true
});

export default userSchema;