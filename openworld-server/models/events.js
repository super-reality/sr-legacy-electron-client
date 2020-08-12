const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define event schema *** */
const eventSchema = new Schema({
    // parent lesson id
    lessonId: { type: ObjectId }, 
    // if child of event, then event id, else if, 0
    parentevent: { type: String }, 
    // event icon url that generated from CV capture automatically
    icon: { type: String },
    // event name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // event long description
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
    // event number
    sNumber: { 
        type: Number, 
        required: true 
    },
    // next event type
    nexteventType: { type: String },
    // event type
    eventType: { type: String },
    // action type
    actionType: { type: String },
    // number of completions
    numberOfCompletions: { type: String },
    // average user engagement
    avgUserEngage: { type: String },
    // event url
    eventUrl: { type: String },
    // user options
    options: { type: Array },
    // user id that created this event
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Event = new model("Event", eventSchema);

module.exports = Event;
