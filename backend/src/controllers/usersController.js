import { usersDao as User } from "../daos/index.js";
import path from "path";

// const manager = new User();

// ! Controladores temporales hasta implementar react
const showLoginHTML = (req, res) => {
   return res.status(200).sendFile(path.resolve("public/html/login.html"));
} 

const loginUser = (req, res) => {
   res.status(300).json({ message: "Logged in" });
}

const showRegisterHTML = (req, res) => {
   res.sendFile(path.resolve("public/html/register.html"))
}

const newUser = async (req, res) => {
   res.status(201).json({ message: "User Created!" });
}

const showRegisterErrorHTML = (req, res) => {
   res.sendFile(path.resolve("public/html/registerError.html"))
}

const loginError = (req, res) => {
   res.sendFile(path.resolve("public/html/loginError.html"));
}

const logout = async (req, res) => {
   try {
      await req.session.destroy();
      res.redirect("/api/users/login");      
   } catch (error) {
      console.error(error);
   }
}


export { newUser, showLoginHTML, loginUser, logout, loginError, showRegisterHTML, showRegisterErrorHTML };