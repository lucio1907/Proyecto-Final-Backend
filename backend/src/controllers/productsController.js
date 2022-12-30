import userUnauthorized from "../helpers/unauthorizedFunction.js";
import { productsDao as Crud } from "../daos/index.js";

const manager = new Crud();

const isAdmin = true;

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await manager.getAll();

    if (allProducts.length === 0) {
      const error = new Error("There are no products yet");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ allProducts });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const getProduct = await manager.getOneElement(id);

    if (!getProduct) {
      const error = new Error("Product Not Found");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ product: getProduct });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const createProduct = async (req, res) => {
  try {
    // Chequear el admin
    if (isAdmin) {
      const newProduct = await manager.create(req.body);

      if (!newProduct) {
        const error = new Error("Something went Wrong");
        return res.status(400).json({ msg: error.message });
      }

      if (process.env.DB_CONNECTION === "firestore") return res.json({ msg: "Product Added!", newProduct: req.body });

      return res.json({ msg: "Product Added!", newProduct });
    } else {
      userUnauthorized(res);
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const doc = req.body;

  try {
    const productUpdated = await manager.update(id, doc);

    if (!productUpdated) {
      const error = new Error("Product not Found");
      return res.status(404).json({ msg: error.message });
    }

    return res.json({ msg: "Product updated!", productUpdated: doc });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await manager.getOneElement(id);

  try {
    // Chequear el admin
    if (isAdmin) {
      const productDeleted = await manager.delete(id);

      if (productDeleted.deletedCount === 0) {
        const error = new Error("The product doesn't exist");
        return res.status(404).json({ msg: error.message });
      }

      if (process.env.DB_CONNECTION === "firestore" && !product) {
        const error = new Error("The product doesn't exist");
        return res.status(404).json({ msg: error.message });
      }

      return res.json({ msg: "Product Deleted!", productDeleted: product });
    } else {
      userUnauthorized(res);
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
