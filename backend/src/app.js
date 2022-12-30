import express from 'express';
import productsRouter from './router/products.routes.js';
import cartRouter from './router/cart.routes.js';
import connectionDB from './config/db.js';

const app = express();

// Conexión a la base
connectionDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);

app.use((req, res) => {
    res.status(404).json({ description: `Route ${req.baseUrl}${req.url} method ${req.method} not implemented`, status: 404 });
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server up'))