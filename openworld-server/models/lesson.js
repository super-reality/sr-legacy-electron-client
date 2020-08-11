const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define lesson schema *** */
const lessonSchema = new Schema({
    // parent subject id
    subjectId: { type: ObjectId }, 
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
        type: Number
    },
    // lesson Rating
    rating: { type: Number },
    // total rating count. this is used for new rating
    ratingCount: { type: Number },
    // number of shares
    numberOfShares: { type: Number },
    // number of activations
    numberOfActivations: { type: Number },
    // number of completions
    numberOfCompletions: { type: String },
    // average user engagement
    avgUserEngage: { type: String },
    // lesson url
    lessonUrl: { type: String },
    // user options
    options: { type: Array },
    // if remixed
    isRemixed: { type: Boolean },
    // original lesson id where remixed from
    remixedFrom: { type: String },
    // user id that created this lesson
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Lesson = new model("Lesson", lessonSchema);

module.exports = Lesson;