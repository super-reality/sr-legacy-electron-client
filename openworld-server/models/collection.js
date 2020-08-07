const {Schema, model} = require("mongoose");
const { Int32, JSON, Double } = require("mongodb");

/* *** define collection schema *** */
const collectionSchema = new Schema({
    icon: { type: String },
    // collection name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // collection short description
    shortDescription: { 
        type: String, 
        index: true
    },
    // collection long description
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
    // total number of subjects
    numberOfSubjects: { type: Int32 },
    // total number of lessons
    numberOfLessons: { type: Int32 },
    // average user engagement
    avgUserEngage: { type: String },
    // collection url
    collectionUrl: { type: String },
    // user options
    options: { type: JSON },
});

const Collection = new model("Collection", collectionSchema);

module.exports = Collection
