const {Schema, model} = require("mongoose");
const { Int32, JSON, Double } = require("mongodb");

/* *** define subject schema *** */
const subjectSchema = new Schema({
    // parent collection id
    collection: { type: String }, 
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
    // medias urls
    medias: { type: Array },
    // number of shares
    numberOfShares: { type: Int32 },
    // number of activations
    numberOfActivations: { type: Int32 },
    // number of completions
    numberOfCompletions: { type: String },
    // average user engagement
    avgUserEngage: { type: String },
    // subject url
    subjectUrl: { type: String },
    // user options
    options: { type: JSON },
    // if remixed
    isRemixed: { type: Boolean },
    // original Subject id where remixed from
    remixedFrom: { type: String },
    // user id that created this subject
    createdBy: { type: String },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Subject = new model("Subject", subjectSchema);

module.exports = Subject