import express from "express";
import passport from "passport";
import { newUser } from "../controllers/usersController.js";

const userRoutes = express.Router();

userRoutes.post("/createUser", passport.authenticate("register", { failureRedirect: "/registerError" }), newUser);

export default userRoutes;