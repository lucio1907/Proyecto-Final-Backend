import FirestoreCartCrud from "../../classes/FirestoreCartCrud.js";

class FirestoreCartCrudExtended extends FirestoreCartCrud {
    constructor () {
        super("carts");
    }
}

export default FirestoreCartCrudExtended;