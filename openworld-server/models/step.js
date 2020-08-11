const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define step schema *** */
const stepSchema = new Schema({
    // parent lesson id
    lessonId: { type: ObjectId }, 
    // if child of step, then step id, else if, 0
    parentStep: { type: String }, 
    // step icon url that generated from CV capture automatically
    icon: { type: String },
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
    // CV medias urls
    cvMedias: { type: Array },
    // CV type: One of OR, AND, NOT
    cvType: { 
        type: String, 
        required: true 
    },
    // step number
    sNumber: { 
        type: Number, 
        required: true 
    },
    // next step type
    nextStepType: { type: String },
    // event type
    eventType: { type: String },
    // action type
    actionType: { type: String },
    // number of completions
    numberOfCompletions: { type: String },
    // average user engagement
    avgUserEngage: { type: String },
    // step url
    stepUrl: { type: String },
    // user options
    options: { type: Array },
    // user id that created this step
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Step = new model("Step", stepSchema);

module.exports = Step;
