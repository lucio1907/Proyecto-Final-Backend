import { usersDao as User } from "../daos/index.js";

const manager = new User();

const newUser = async (req, res) => {
   return res.status(201).json({ message: "User Created!" });
}


export { newUser };