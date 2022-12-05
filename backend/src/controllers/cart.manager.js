const fs = require("fs");

const _FILE = "./src/data/carts.json";

class CartManager {
  constructor() {
    this.cart = {};
  }

  async create() {
    try {
      if (fs.existsSync(_FILE)) {
        const data = await fs.promises.readFile(_FILE, "utf-8");
        let cartParsed = JSON.parse(data);
        this.cart.id = cartParsed.length + 1;

        // Estructura del carrito
        this.cart = {
          id: this.cart.id,
          timestamp: Date.now(),
          ...this.cart,
          products: []
        };

        cartParsed.push(this.cart);

        await fs.promises.writeFile(_FILE, JSON.stringify(cartParsed, null, 2));
        return { msg: "Cart Created", status: 200, cart: this.cart.id };
      } else {
        let id = 1;
        this.cart.id = id;

        // Estructura del carrito
        this.cart = {
          id: this.cart.id,
          timestamp: Date.now(),
          ...this.cart,
          products: []
        };

        await fs.promises.writeFile(_FILE, JSON.stringify([this.cart], null, 2));
        return this.cart;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async findAndCreate(cartId, product) {
    const id = parseInt(cartId);

    try {
      const data = await fs.promises.readFile(_FILE, "utf-8");
      let cartParsed = JSON.parse(data);

      let cartFinded = cartParsed.find((cart) => cart.id === id);

      // Validaciones
      if (isNaN(id) || id <= 0) {
        const error = new Error('Wrong ID');
        return { msg: error.message, status: 400 };
      }

      if (cartFinded === undefined) {
        const error = new Error("Cart not Found");
        return { msg: error.message, status: 404 };
      } else {
        product.id = cartFinded.products.length + 1;
        
        // Estructura del producto
        product = {
          id: product.id,
          timestamp: Date.now(),
          ...product
        }

        cartFinded.products = [...cartFinded.products, product];
        await fs.promises.writeFile(_FILE, JSON.stringify(cartParsed, null, 2));
        
        return { msg: 'Product Added', status: 200, product };
      }
    } catch (error) {
      console.error(error);
    }
  }

  delete(cartId) {
    let id = parseInt(cartId);
    const data = fs.readFileSync(_FILE, 'utf-8');
    let cartParsed = JSON.parse(data);

    let findCart = cartParsed.find(cart => cart.id === id);

    // Validaciones
    if (isNaN(id) || id <= 0) {
      const error = new Error('Wrong ID');
      return { msg: error.message, status: 400 };
    }
    
    if (findCart === undefined) {
      const error = new Error('Cannot find that Cart');
      return { msg: error.message, status: 404 };
    } else {
      let cartRemoved = cartParsed.filter(cart => cart.id !== id);

      fs.writeFileSync(_FILE, JSON.stringify(cartRemoved, null, 2));
      return { msg: 'Cart Removed', status: 200, cartRemoved: findCart };
    }
    
  }
  //! TERMINAR
  deleteById(cartId, productId) {
    const data = fs.readFileSync(_FILE, 'utf-8');
    let cartParsed = JSON.parse(data);

    let cartFinded = cartParsed.find(cart => cart.id === parseInt(cartId));
    let productFinded = cartFinded.products.find(product => product.id === parseInt(productId));
    
    // Validaciones
    if ((parseInt(cartId) && parseInt(productId)) <= 0 || isNaN(parseInt(cartId) && parseInt(productId))) {
      const error = new Error('Wrong ID');
      return { msg: error.message, status: 400 };
    }

    if (cartFinded === undefined) {
      const error = new Error('Cart not Found');
      return { msg: error.message, status: 404 };
    } 

    if (productFinded === undefined) {
      const error = new Error('Product not Found');
      return { msg: error.message, status: 404 };
    } else {
      let productRemoved = cartFinded.products.filter(product => product.id !== parseInt(productId));
      
      // Actualiza el array de productos
      cartFinded.products = productRemoved;

      fs.writeFileSync(_FILE, JSON.stringify(cartParsed, null, 2));

      return { msg: 'Product Removed!', status: 200, productRemoved: productFinded };
    }
  }

  findById (cartId) {
    let id = parseInt(cartId);
    const data = fs.readFileSync(_FILE, 'utf-8');
    let cartParsed = JSON.parse(data);

    let cartFinded = cartParsed.find(cart => cart.id === id);

    if (isNaN(id) || id <= 0) {
      const error = new Error('Wrong ID');
      return { msg: error.message, status: 400 };
    }
    
    if (cartFinded === undefined) {
      const error = new Error("That cart doesn't exists");
      return { msg: error.message, status: 404 };
    } else {
      return { msg: 'Cart Found!', status: 200, cart: cartFinded };
    }
  }
}

module.exports = CartManager;
