import express from 'express';
import session from 'express-session';
import cookieParser from "cookie-parser";
import productsRouter from './router/products.routes.js';
import cartRouter from './router/cart.routes.js';
import connectionDB from './config/db.js';
import connectionFirestore from './db/firestoreconnection.js';
import userRoutes from './router/users.routes.js';
import dotenv from "dotenv";
import passport from 'passport';
import MongoStore from "connect-mongo";
import initializePassport from './config/passport.js';

/*
    Un menú de registro y autenticación de usuarios basado en passport local,
    guardando en la base de datos las credenciales y el resto de los datos ingresados al momento del registro. 
*/

dotenv.config();

const app = express();

// Conexión a la base
switch (process.env.DB_CONNECTION) {
    case "mongodb":
        connectionDB();
        break;
    case "firestore":
        connectionFirestore();
        console.log("Firestore running 🔥");
        break;
    default:
        break;
}

const sessionConfig = session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    key: "user_sid",
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
initializePassport()

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
    res.status(308).redirect("/api/productos");
})

app.use((req, res) => {
    res.status(404).json({ description: `Route ${req.baseUrl}${req.url} method ${req.method} not implemented`, status: 404 });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server up'))