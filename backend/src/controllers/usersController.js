import { usersDao as User } from "../daos/index.js";
import dotenv from "dotenv";
import logConfiguration from "../helpers/log4jsConfig.js";

dotenv.config();

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const manager = new User();

// Si el usuario se loguea que devuelva un mensaje
const loginUser = (req, res) => {
  res.status(300).json({ message: "Logged in" });
};

const newUser = async (req, res) => {
  res.status(201).json({ msg: "User created!" });
};

const showRegisterError = (req, res) => {
  res.status(400).json({ message: "That user already exists" })
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
  loginUser,
  logout,
  showRegisterError,
  userDescription,
};
