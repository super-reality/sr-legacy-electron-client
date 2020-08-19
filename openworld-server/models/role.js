const {Schema, model} = require("mongoose");

/* *** define role schema *** */
const roleSchema = new Schema({
    // name : either of Manager, Editor, Contributor, Default. Can be expandable
    name: { type: String }, 
    // can create
    canCreate: { type: Boolean },
    // can read
    canRead: { type: Boolean },
    // can update
    canUpdate: { type: Boolean },
    // can delete
    canDelete: { type: Boolean },
    // short code: CRUD value
    // for example: 14 (0x1110) means can create, read and update, but not delete
    shortCode: { 
        type: Number, 
        required: true,
    },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Role = new model("Role", roleSchema);

module.exports = Role;
