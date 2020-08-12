const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define organization user role schema *** */
const organizationUserRoleSchema = new Schema({
    // organization id
    organizationId: { type: ObjectId }, 
    // user id
    userId: { type: ObjectId }, 
    // role id
    roleId: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const OrganizationUserRole = new model("OrganizationUserRole", organizationUserRoleSchema);

module.exports = OrganizationUserRole;
