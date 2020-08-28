const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

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
    // tag Array
    tags: { type: Array },
    // medias urls
    medias: { type: Array },
    // visibility
    visibility: { type: Array },
    // entry
    entry: { type: Number },
    // number of shares
    numberOfShares: { type: Number },
    // number of activations
    numberOfActivations: { type: Number },
    // total number of subjects
    numberOfSubjects: { type: Number },
    // total number of lessons
    numberOfLessons: { type: Number },
    // average user engagement
    avgUserEngage: { type: String },
    // user options
    options: { type: Array },    
    // if remixed
    isRemixed: { type: Boolean },
    // original collection id where remixed from
    remixedFrom: { type: String },
    // user id that created this collection
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Collection = new model("Collection", collectionSchema);

module.exports = Collection
