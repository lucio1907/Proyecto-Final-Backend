const fs = require('fs');

const _FILE = './src/data/products.json';

class ProductsManager {
    async create(product) {
        try {
            if (Object.values(product).includes('') || (isNaN(product.price) || product.price <= 0) || isNaN(product.thumbnail) || (isNaN(product.stock) || product.stock <= 0)) {
                const error = new Error("Something went wrong, check your product again!");
                return { msg: error.message, status: 400 };
            }

            if (fs.existsSync(_FILE)) {
                const data = await fs.promises.readFile(_FILE, 'utf-8');
                let productParsed = JSON.parse(data);
                product.id = productParsed.length + 1;
                
                product = {
                    id: product.id,
                    timestamp: Date.now(),
                    ...product
                }

                productParsed.push(product); 
                
                await fs.promises.writeFile(_FILE, JSON.stringify(productParsed, null, 2));
                return { msg: 'Product Added', status: 200, product };
            } else {
                let id = 1;
                product.id = id;

                product = {
                    id: product.id,
                    timestamp: Date.now(),
                    ...product
                }

                await fs.promises.writeFile(_FILE, JSON.stringify([product], null, 2));
                return product;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async update(productId, newUpdatedProduct) {
        let id = parseInt(productId);
        
        try {
            const data = await fs.promises.readFile(_FILE, 'utf-8');
            let productParsed = JSON.parse(data);

            // Validaciones
            if (Object.values(newUpdatedProduct).includes('') || (isNaN(newUpdatedProduct.price) || newUpdatedProduct.price <= 0) || isNaN(newUpdatedProduct.thumbnail) || (isNaN(newUpdatedProduct.stock) || newUpdatedProduct.stock <= 0)) {
                const error = new Error("Something went wrong, check your product again!");
                return { msg: error.message, status: 400 };
            }

            if (productParsed.length === 0) {
                const error = new Error('No products to Update');
                return { msg: error.message, status: 404 };
            }

            if (isNaN(id) || id <= 0) {
                const error = new Error('Wrong ID');
                return { msg: error.message, status: 400 };
            }

            let productToUpdate = productParsed.find(product => product.id === id);

            // Estructura del producto
            newUpdatedProduct = {
                id: productToUpdate.id,
                ...newUpdatedProduct
            }

            productParsed[productToUpdate.id - 1] = newUpdatedProduct;

            await fs.promises.writeFile(_FILE, JSON.stringify(productParsed, null, 2));
            return { msg: 'Product Updated!', status: 200, updatedProduct: newUpdatedProduct, oldProduct: productToUpdate };
        } catch (error) {
            console.error(error);
        }
        
    }

    delete(productId) {
        let id = parseInt(productId);
        try {
            const data = fs.readFileSync(_FILE, 'utf-8');
            let productParsed = JSON.parse(data);

            if (id <= 0) {
                const error = new Error("ID invalid");
                return { msg: error.message, status: 400 };
            }

            if (isNaN(id)) {
                const error = new Error("Not a number");
                return { msg: error.message, status: 400 };
            }

            const findProductId = productParsed.find(prod => prod.id === id);
            
            if (findProductId === undefined) {
                const error = new Error('That product was removed or never existed');
                return { msg: error.message, status: 404 };
            } else {
                let newArray = productParsed.filter(product => product.id !== id);
                fs.writeFileSync(_FILE, JSON.stringify(newArray, null, 2));

                if (newArray.length === 0) {
                    const error = new Error('No more products');
                    return { msg: error.message, status: 404 };
                } else {
                    return { msg: 'Product Removed!', status: 200, productRemoved: findProductId };
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    findAll() {
        const data = fs.readFileSync(_FILE, 'utf-8');
        let productParsed = JSON.parse(data);

        if (productParsed.length === 0) {
            const error = new Error('There are not products yet, add one!');
            return { msg: error.message, status: 404 };
        } else {
            return { msg: 'All Products Found', status: 200, result: productParsed };
        }
    }

    findById(productId) {
        let id = parseInt(productId)
        const data = fs.readFileSync(_FILE, 'utf-8');
        let productParsed = JSON.parse(data);
        const findId = productParsed.find(prod => prod.id === id);

        if (!findId) {
            const error = new Error('Cannot found that product');
            return { msg: error.message, status: 404 };
        } else {
            return { msg: 'Product Found!', status: 200, product: findId };
        }
    }
}

module.exports = ProductsManager;