const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define step schema *** */
const stepSchema = new Schema({
    // step icon url
    icon: { 
        type: String,
        required: true, 
    },
    // step name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // step long description
    description: { 
        type: String, 
        required: true 
    },
    // images and functions
    imageFunctions: { type: Array },
    // trigger
    trigger: { type: String },
    // action
    action: { type: String },
    // next Step action
    next: { type: Number },
    // user id that created this step
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Step = new model("Step", stepSchema);

module.exports = Step;