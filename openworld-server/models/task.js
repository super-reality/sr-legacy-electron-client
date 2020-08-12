const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define task schema *** */
const taskSchema = new Schema({
    // parent lesson id
    lessonId: { type: ObjectId }, 
    // if child of task, then task id, else if, 0
    parenttask: { type: String }, 
    // task icon url that generated from CV capture automatically
    icon: { type: String },
    // task name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // task long description
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
    // task number
    sNumber: { 
        type: Number, 
        required: true 
    },
    // next task type
    nexttaskType: { type: String },
    // event type
    eventType: { type: String },
    // action type
    actionType: { type: String },
    // number of completions
    numberOfCompletions: { type: String },
    // average user engagement
    avgUserEngage: { type: String },
    // task url
    taskUrl: { type: String },
    // user options
    options: { type: Array },
    // user id that created this task
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Task = new model("Task", taskSchema);

module.exports = Task;
