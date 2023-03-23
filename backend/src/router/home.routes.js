import express from "express";
import { showHomeHTML } from "../controllers/homeController.js";
import routeValidator from "../middlewares/routeValidator.middleware.js";

const homeRoutes = express.Router();

homeRoutes.get("/", routeValidator, showHomeHTML)

export default homeRoutes;