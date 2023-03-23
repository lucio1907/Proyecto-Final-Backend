import express from "express";
import passport from "passport";
import {
  loginError,
  loginUser,
  logout,
  newUser,
  showLoginHTML,
  showRegisterErrorHTML,
  showRegisterHTML,
} from "../controllers/usersController.js";

const userRoutes = express.Router();

userRoutes.get("/login", showLoginHTML);
userRoutes.post("/loginUser", passport.authenticate("login", { failureRedirect: "/api/users/loginError" }), loginUser);
userRoutes.get("/loginError", loginError);
userRoutes.get("/logout", logout);

userRoutes.get("/register", showRegisterHTML);
userRoutes.post("/createUser", passport.authenticate("register", { failureRedirect: "/api/users/registerError" }), newUser);
userRoutes.get("/registerError", showRegisterErrorHTML);

export default userRoutes;
