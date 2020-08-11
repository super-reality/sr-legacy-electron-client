const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define resource schema *** */
const resourceSchema = new Schema({
    // resource icon url
    icon: { type: String },
    // resource name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // resource long description
    description: { 
        type: String, 
        required: true 
    },
    // medias urls
    medias: { type: Array },
    // user id that created this resource
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Resource = new model("Resource", resourceSchema);

module.exports = Resource;