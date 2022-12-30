import MongoCrudCart from "../../classes/MongoCrudCart.js";
import cartSchema from "../../models/carts.model.js";

class MongoCrudCartExtended extends MongoCrudCart {
    constructor () {
        super("Carts", cartSchema);
    }
}

export default MongoCrudCartExtended;