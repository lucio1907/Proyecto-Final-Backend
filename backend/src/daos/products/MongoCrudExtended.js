import MongoCrud from "../../classes/MongoCrud.js";
import productsSchema from '../../models/products.model.js'

class MongoCrudExtended extends MongoCrud {
    constructor () {
        super("Products", productsSchema);
    }
}

export default MongoCrudExtended;