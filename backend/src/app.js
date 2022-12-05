const express = require('express');
const productsRouter = require('./router/products.routes.js')
const cartRouter = require('./router/cart.routes.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);

app.use((req, res) => {
    res.status(404).json({ description: `Route ${req.baseUrl}${req.url} method ${req.method} not implemented`, status: 404 });
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server up'))