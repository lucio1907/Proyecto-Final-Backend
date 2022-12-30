import FirestoreProductsCrud from "../../classes/FirestoreProductsCrud.js";

class FirestoreProductsCrudExtended extends FirestoreProductsCrud {
    constructor () {
        super("products");
    }
}

export default FirestoreProductsCrudExtended;