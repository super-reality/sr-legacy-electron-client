const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define point pool schema *** */
const pointpoolSchema = new Schema({
    // pointpool icon url
    icon: { type: String },
    // pointpool name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // pointpool long description
    description: { 
        type: String, 
        required: true 
    },
    // medias urls
    medias: { type: Array },
    // user id that created this pointpool
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Pointpool = new model("Pointpool", pointpoolSchema);

module.exports = Pointpool;