const { Schema, model } = require("mongoose");
const { Int32, JSON, Double } = require("mongodb");

/* *** define lesson schema *** */
const lessonSchema = new Schema({
    // parent subject id
    subject: { type: String }, 
    // lesson icon url
    icon: { type: String },
    // lesson name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // lesson short description
    shortDescription: { 
        type: String, 
        index: true
    },
    // lesson long description
    description: { 
        type: String, 
        required: true 
    },
    // medias urls
    medias: { type: Array },
    // total steps
    totalSteps: { 
        type: Int32
    },
    // lesson Rating
    rating: { type: Double },
    // total rating count. this is used for new rating
    ratingCount: { type: Int32 },
    // number of shares
    numberOfShares: { type: Int32 },
    // number of activations
    numberOfActivations: { type: Int32 },
    // number of completions
    numberOfCompletions: { type: String },
    // average user engagement
    avgUserEngage: { type: String },
    // lesson url
    lessonUrl: { type: String },
    // user options
    options: { type: JSON },
    // if remixed
    isRemixed: { type: Boolean },
    // original lesson id where remixed from
    remixedFrom: { type: String }
});

const Lesson = new model("Lesson", lessonSchema);

module.exports = Lesson;