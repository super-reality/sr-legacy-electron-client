const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define collection user role schema *** */
const collectionUserRoleSchema = new Schema({
    // collection id
    collectionId: { type: ObjectId }, 
    // user id
    userId: { type: ObjectId }, 
    // role id
    roleId: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const CollectionUserRole = new model("CollectionUserRole", collectionUserRoleSchema);

module.exports = CollectionUserRole;
