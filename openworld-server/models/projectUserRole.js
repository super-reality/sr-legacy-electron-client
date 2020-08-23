const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define project user role schema *** */
const projectUserRoleSchema = new Schema({
    // project id
    projectId: { type: ObjectId }, 
    // user id
    userId: { type: ObjectId }, 
    // role id
    roleId: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const ProjectUserRole = new model("ProjectUserRole", projectUserRoleSchema);

module.exports = ProjectUserRole;
