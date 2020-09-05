const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define favor schema *** */
const favorSchema = new Schema({
    // user id 
    user: { 
        type: ObjectId, 
        required: true,
    },
    // favor lessons id array
    lessons: { type: Array },
    // created date
    createdAt: { type: Date, default: Date.now }
});

const Favor = new model("Favor", favorSchema);

module.exports = Favor;