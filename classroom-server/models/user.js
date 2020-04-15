const {Schema, model} = require("mongoose");

const User = new model("User", new Schema({
    root: {
        type: Boolean
    },
    username: {
        type: String,
        index: true
    },
    passwordSalt: {
        type: String
    },
    passwordHash: {
        type: String
    }
}));

module.exports = User;
