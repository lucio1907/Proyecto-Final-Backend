import connectionFirestore from "../db/firestoreconnection.js";

class FirestoreProductsCrud {
  constructor(collectionName) {
    const db = connectionFirestore();
    this.db = db.collection(collectionName);
  }

  async getAll() {
    try {
      const allProducts = await this.db.get();
      let docs = allProducts.docs;

      const response = docs.map((products) => ({
        id: products.id,
        ...products.data(),
      }));

      return response;
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async getOneElement(id) {
    try {
      const doc = this.db.doc(id);
      const product = await doc.get();
      const response = product.data();

      return response;
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async create(body) {
    try {
      const doc = await this.db.doc();
      const newProduct = await doc.create(body);
      return newProduct;
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async update(id, doc) {
    try {
      const productToUpdate = this.db.doc(id);
      const productUpdated = await productToUpdate.update(doc);
      
      return productUpdated;
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }

  async delete(id) {
    try {
      const productToDelete = this.db.doc(id);
      const productDeleted = await productToDelete.delete();
      console.log(productDeleted);

      return productDeleted;
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }
}

export default FirestoreProductsCrud;
