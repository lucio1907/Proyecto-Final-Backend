import bcrypt from "bcrypt";

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValid = (user, password) => bcrypt.compareSync(password, user.password);

export { hashPassword, isValid };