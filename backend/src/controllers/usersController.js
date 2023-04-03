import { usersDao as User } from "../daos/index.js";
import path from "path";
import logConfiguration from "../helpers/log4jsConfig.js";

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const manager = new User();

const showLoginHTML = (req, res) => {
  return res.status(200).sendFile(path.resolve("public/html/login.html"));
};

// Si el usuario se loguea que devuelva un mensaje
const loginUser = (req, res) => {
  res.status(300).json({ message: "Logged in" });
};

const showRegisterHTML = (req, res) => {
  res.sendFile(path.resolve("public/html/register.html"));
};

const newUser = async (req, res) => {
  res.status(201).json({ message: "User Created!" });
};

const showRegisterErrorHTML = (req, res) => {
  res.sendFile(path.resolve("public/html/registerError.html"));
};

const loginError = (req, res) => {
  res.sendFile(path.resolve("public/html/loginError.html"));
};

// Borra la session para desloguear al usuario
const logout = async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect("/api/users/login");
  } catch (error) {
    logger.error(error);
  }
};

const showUserDescriptionHTML = (req, res) => {
  res.sendFile(path.resolve("public/html/userDescription.html"));
};

// Obtiene el usuario actual
const userDescription = async (req, res) => {
  try {
    const userID = req.session.passport.user;
    const currentUser = await manager.findUserById(userID);

    res.json(currentUser);
  } catch (error) {
    logger.error(error);
  }
};

export {
  newUser,
  showLoginHTML,
  loginUser,
  logout,
  loginError,
  showRegisterHTML,
  showRegisterErrorHTML,
  showUserDescriptionHTML,
  userDescription,
};
