import { cartDao as Crud } from "../daos/index.js";

const manager = new Crud();

const createCart = async (req, res) => {
  try {
    const newCart = await manager.create();
    res.json({ newCart });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const getCart = async (req, res) => {
  const { id } = req.params;
  try {
    const getCart = await manager.getOneCart(id);

    if (!getCart) {
      const error = new Error("Cart not Found");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ cart: getCart });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const createProduct = async (req, res) => {
  const { id } = req.params;
  const productUpdated = req.body;

  try {
    const cart = await manager.createProduct(id, productUpdated);

    if (cart.modifiedCount === 0) {
      const error = new Error("Cannot update the product");
      return res.status(400).json({ msg: error.message });
    }

    return res.json({ msg: "Product Added!", productUpdated });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const deleteCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await manager.deleteCart(id);

    if (cart.deletedCount === 0) {
      const error = new Error("Cart not Found");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ msg: `Cart with id "${id}" deleted!` });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const deleteProductCart = async (req, res) => {
  const { id, id_prod } = req.params;

  try {
    const productDeleted = await manager.deleteProductCart(id, id_prod);

    if (productDeleted === undefined) {
      const error = new Error("Product not Found");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ msg: `Product with id ${productDeleted._id} deleted!` });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

export { createCart, getCart, createProduct, deleteCart, deleteProductCart };
