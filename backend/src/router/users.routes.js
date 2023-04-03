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
  showUserDescriptionHTML,
  userDescription,
} from "../controllers/usersController.js";
import routeValidator from "../middlewares/routeValidator.middleware.js";

const userRoutes = express.Router();

// LOGIN
userRoutes.get("/login", showLoginHTML);
userRoutes.post("/loginUser", passport.authenticate("login", { failureRedirect: "/api/users/loginError" }), loginUser);
userRoutes.get("/loginError", loginError);
userRoutes.get("/logout", logout);

// REGISTER
userRoutes.get("/register", showRegisterHTML);
userRoutes.post("/createUser", passport.authenticate("register", { failureRedirect: "/api/users/registerError" }), newUser);
userRoutes.get("/registerError", showRegisterErrorHTML);

// USER DESCRIPTION
userRoutes.get("/userDescription.html", routeValidator, showUserDescriptionHTML);
userRoutes.get("/userDescription", userDescription);

export default userRoutes;
