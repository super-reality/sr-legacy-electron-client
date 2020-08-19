const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define subject schema *** */
const subjectSchema = new Schema({
    // parent collection id
    collectionId: { type: ObjectId }, 
    // subject icon url
    icon: { type: String },
    // subject name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // subject short description
    shortDescription: { 
        type: String, 
        index: true
    },
    // subject long description
    description: { 
        type: String, 
        required: true 
    },
    // tag Array
    tags: { type: Array },
    // medias urls
    medias: { type: Array },
    // visibility
    visibility: { type: String },
    // entry
    entry: { type: String },
    // number of shares
    numberOfShares: { type: Number },
    // number of activations
    numberOfActivations: { type: Number },
    // number of completions
    numberOfCompletions: { type: Number },
    // user options
    options: { type: Array },
    // if remixed
    isRemixed: { type: Boolean },
    // original Subject id where remixed from
    remixedFrom: { type: String },
    // user id that created this subject
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Subject = new model("Subject", subjectSchema);

module.exports = Subject