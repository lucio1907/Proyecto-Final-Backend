import express from "express";
import passport from "passport";
import {
  loginUser,
  logout,
  newUser,
  showRegisterError,
  userDescription,
} from "../controllers/usersController.js";

const userRoutes = express.Router();

// LOGIN
userRoutes.post("/loginUser", passport.authenticate("login", { failureRedirect: "/api/users/loginError" }), loginUser);
userRoutes.get("/logout", logout);

// REGISTER
userRoutes.post("/createUser", passport.authenticate("register", { failureRedirect: "/api/users/registerError", failureMessage: "This user already exists" }), newUser);
userRoutes.get("/registerError", showRegisterError);

// USER DESCRIPTION
userRoutes.get("/userDescription", userDescription);

export default userRoutes;
