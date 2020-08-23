const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define organization schema *** */
const organizationSchema = new Schema({
    // organization icon url
    icon: { type: String },
    // organization name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // organization description
    description: { 
        type: String, 
        required: true 
    },
    // organization Rating
    rating: { type: Number },
    // total rating count. this is used for new rating
    ratingCount: { type: Number },
    // user id that created this organization
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Organization = new model("Organization", organizationSchema);

module.exports = Organization;