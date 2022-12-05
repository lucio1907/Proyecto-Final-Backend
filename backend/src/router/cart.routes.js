const express = require('express');
const CartManager = require('../controllers/cart.manager.js');

const cartRouter = express.Router(); 

const manager = new CartManager();

cartRouter.get('/:id/productos', (req, res) => {
    let result = manager.findById(req.params.id);
    res.status(result.status).json(result);
})

cartRouter.post('/', (req, res) => {
    let result = manager.create();
    result.then(data => res.status(data.status).json(data));
})

cartRouter.post('/:id/productos', (req, res) => {
    const { id } = req.params;
    const newProduct = req.body;

    let result = manager.findAndCreate(id, newProduct);
    result.then(data => res.status(data.status).json(data));
})

cartRouter.delete('/:id', (req, res) => {
    let result = manager.delete(req.params.id);
    res.status(result.status).json(result);
})

cartRouter.delete('/:id/productos/:id_prod', (req, res) => {
    const { id, id_prod } = req.params;
    let result = manager.deleteById(id, id_prod);

    res.status(result.status).json(result);
})

module.exports = cartRouter;