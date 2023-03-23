import passport from "passport";
import local from "passport-local";
import { usersDao as Users } from "../daos/index.js";
import { cartDao as Cart } from "../daos/index.js";
import { hashPassword, isValid } from "../helpers/bcrypt.js";

const managerUsers = new Users();
const managerCarts = new Cart();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true },
      async (req, username, password, done) => {
        const { email, age, address, phone, prefix, avatar } = req.body;
        try {
          const user = await managerUsers.findUser(username);
          if (user) return done(null, false);

          const newUser = {
            username,
            email,
            password: hashPassword(password),
            age,
            address,
            phone: `${prefix}${phone}`,
            avatar: checkAvatar(avatar),
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

  // TODO: Verifica que la cuenta exista en la base de datos y compara la contraseña enviada con la ya cargada en la BD para hacer el logueo
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
      try {
        const user = await managerUsers.findUser(email);
        if (!user) return done(null, false);
        if (!isValid(user, password)) return done(null, false);
        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );
};

// TODO: Verifica si se carga avatar o no, ya que en este caso es opcional
const checkAvatar = (avatar) => {
  if (!avatar || avatar === undefined) return "No avatar selected"

  if (avatar.length > 0) return avatar;
}

export default initializePassport;
