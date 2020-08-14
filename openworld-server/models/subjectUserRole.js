const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define subject user role schema *** */
const subjectUserRoleSchema = new Schema({
    // subject id
    subjectId: { type: ObjectId }, 
    // user id
    userId: { type: ObjectId }, 
    // role id
    roleId: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const SubjectUserRole = new model("SubjectUserRole", subjectUserRoleSchema);

module.exports = SubjectUserRole;
