import passport from "passport";
import local from "passport-local";
import { usersDao as Users } from "../daos/index.js";
import { cartDao as Cart } from "../daos/index.js";
import { hashPassword } from "../helpers/bcrypt.js";

const managerUsers = new Users();
const managerCarts = new Cart();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true },
      async (req, username, password, done) => {
        const { email, age, address, phone, avatar } = req.body;
        try {
          const user = await managerUsers.findUser({ username });
          if (user) return done(null, false);

          const newUser = {
            username,
            email,
            password: hashPassword(password),
            age,
            address,
            phone,
            avatar,
          };

        // TODO: Insertar carrito al usuario y guardarlo en la base de datos   
          try {
            const newCart = await managerCarts.create();
            const assignCartToUser = { ...newUser, cart: newCart._id };
            const finalUser = await managerUsers.createUser(assignCartToUser);
            return done(null, finalUser);
          } catch (error) {
            done(error);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const userID = await managerUsers.findUserById(id);
      done(null, userID._id);
    } catch (error) {
      console.error(error);
    }
  });
};

export default initializePassport;
