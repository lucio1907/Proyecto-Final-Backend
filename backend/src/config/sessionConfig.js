import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const sessionConfig = session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  key: "user_sid",
  secret: process.env.SECRET_KEY,
  resave: true,
  cookie: { maxAge: 600000 },
  saveUninitialized: true,
});

export default sessionConfig;