import os from "os";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRouter from './router/products.routes.js';
import cartRouter from './router/cart.routes.js';
import connectionDB from './config/db.js';
import userRoutes from './router/users.routes.js';
import dotenv from "dotenv";
import cluster from "cluster";
import passport from 'passport';
import initializePassport from './config/passport.js';
import sessionConfig from "./config/sessionConfig.js";
import routeValidator from './middlewares/routeValidator.middleware.js';
import sessionChecker from './middlewares/sessionChecker.middleware.js';
import logConfiguration from "./helpers/log4jsConfig.js";

dotenv.config();

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const app = express();

const PORT = process.argv[2] || 8080;

const quantityCpus = os.cpus().length;

if (process.argv[3] === "CLUSTER") {
  if (cluster.isPrimary) {
    for (let i = 0; i <= quantityCpus; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      logger.info(`Worker ${worker} exit`);
      cluster.fork();
    })
  } else {
    app.listen(PORT, () => console.log("Server Up! 🔥"));
  } 
} else {
  app.listen(PORT, () => console.log("Server Up! 🔥"));
}

// Conexión a la base
switch (process.env.DB_CONNECTION) {
    case "mongodb":
        connectionDB();
        break;
    default:
        break;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializePassport()
app.use(cors());
app.use(cookieParser());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());


app.use("/api/users/login", express.static("public"));
app.use("/api/users/register", express.static("public"));
app.use("/api/productos", express.static("public"));
app.use("/api/users", express.static("public"));
app.use("/api/carrito", express.static("public"));

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);
app.use('/api/users', userRoutes);

app.get("/", routeValidator, sessionChecker, (req, res) => {
    res.status(308).redirect("/api/users/login"); 
})

app.use((req, res) => {
    res.status(404).json({ description: `Route ${req.baseUrl}${req.url} method ${req.method} not implemented`, status: 404 });
});
