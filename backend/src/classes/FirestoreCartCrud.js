import connectionFirestore from "../db/firestoreconnection.js";

class FirestoreCartCrud {
  constructor(collectionName) {
    const db = connectionFirestore();
    this.db = db.collection(collectionName);
  }

  async create() {
    try {
      const cart = this.db.doc();
      await cart.create({ products: [] });

      return { id: cart.id, products: [] };
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async getOneCart(id) {
    try {
      const doc = this.db.doc(id);
      const cart = await doc.get();
      const response = { id, ...cart.data() };

      if (!cart.data()) {
        return { status: 404 };
      } else {
        return { status: 200, response };
      }
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async createProduct(id, doc) {
    try {
      const cart = await this.db.doc(id).get();
      const productId = this.db.doc();
      // Asigna ID al producto
      doc.id = productId.id;
      const newProduct = { products: [...cart.data().products, doc] };

      return await this.db.doc(id).update(newProduct);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async deleteCart(id) {
    try {
      return await this.db.doc(id).delete();
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async deleteProductCart(idCart, idProduct) {
    try {
      const cart = await this.db.doc(idCart).get();   
      const productToDelete = cart.data().products.filter((product) => product.id !== idProduct); // Nuevo Array
      const productDeleted = { products: productToDelete }; // Se convierte a objeto para pasarlo a firestore
      const products = cart.data().products.find((product) => product.id === idProduct); 

      if (!products) {
        return { status: 404 };
      } else {
        await this.db.doc(idCart).update(productDeleted);
        return { status: 200, products };
      }
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }
}

export default FirestoreCartCrud;
