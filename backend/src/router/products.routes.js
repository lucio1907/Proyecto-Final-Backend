const express = require("express");
const ProductManager = require("../controllers/products.manager.js");
const userUnauthorized = require("../helpers/unauthorizedFunction.js");

const productsRouter = express.Router();
const manager = new ProductManager();

const isAdmin = true;

productsRouter.get("/", (req, res) => {
  const result = manager.findAll();
  res.status(result.status).json(result);
});

productsRouter.get("/:id", (req, res) => {
  let result = manager.findById(req.params.id);
  res.status(result.status).json(result);
});

productsRouter.post("/", (req, res) => {
  const newProduct = req.body;

  // Chequear el admin
  if (isAdmin) {
      let result = manager.create(newProduct);
      result.then(data => res.status(data.status).json(data)); 
  } else {
    userUnauthorized(res);
  }
});

productsRouter.put("/:id", (req, res) => {
  let result = manager.update(req.params.id, req.body);
  result.then(data => res.status(data.status).json(data));
});

productsRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Chequear el admin
  if (isAdmin) {
    // Nuevo array sin el producto eliminado
    const result = manager.delete(id);

    res.status(result.status).json(result);
  } else {
    userUnauthorized(res);
  }
});

module.exports = productsRouter;
