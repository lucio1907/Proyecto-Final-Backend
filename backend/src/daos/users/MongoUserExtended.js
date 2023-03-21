import MongoUser from "../../classes/MongoUser.js";
import userSchema from "../../models/user.model.js";

class MongoUserExtended extends MongoUser {
    constructor () {
        super("Users", userSchema);
    }
}

export default MongoUserExtended;