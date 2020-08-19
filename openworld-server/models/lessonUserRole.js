const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define lesson user role schema *** */
const lessonUserRoleSchema = new Schema({
    // lesson id
    lessonId: { type: ObjectId }, 
    // user id
    userId: { type: ObjectId }, 
    // role id
    roleId: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const LessonUserRole = new model("LessonUserRole", lessonUserRoleSchema);

module.exports = LessonUserRole;
