const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define job post schema *** */
const jobpostSchema = new Schema({
    // jobpost icon url
    icon: { type: String },
    // jobpost name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // jobpost long description
    description: { 
        type: String, 
        required: true 
    },
    // medias urls
    medias: { type: Array },
    // user id that created this jobpost
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Jobpost = new model("Jobpost", jobpostSchema);

module.exports = Jobpost;