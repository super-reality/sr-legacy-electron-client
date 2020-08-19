const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define project schema *** */
const projectSchema = new Schema({
    // project icon url
    icon: { type: String },
    // project name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // project long description
    description: { 
        type: String, 
        required: true 
    },
    // medias urls
    medias: { type: Array },
    // budget
    budget: { type: Number },
    // visibility: either of Public/Team/Private
    visibility: { type: String },
    // user id that created this project
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Project = new model("Project", projectSchema);

module.exports = Project;