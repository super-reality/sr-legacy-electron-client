const {Schema, model} = require("mongoose");
const {hashDigest, hashSaltDigest} = require("../utilities/hashing");

const userSchema = new Schema({
    passwordHash: {
        type: String
    },
    passwordSalt: {
        type: String
    },
    root: {
        type: Boolean
    },
    username: {
        type: String,
        index: true
    },
    firstname: { type: String },
    lastname: { type: String },
    inviteCode: { type: String },
    age: { type: Number },
    // description
    description: { type: String },
    budget: { type: Number },
    escrow: { type: Number },
    // visibility: either of Public/Team/Private
    visibility: { type: String },
    role: { type: String }
});

userSchema.methods.setPassword = function(password) {
    this.passwordSalt = hashDigest(Date.now().toString());
    this.passwordHash = hashSaltDigest(password, this.passwordSalt);
}

userSchema.methods.checkPassword = function(password) {
    return hashSaltDigest(password, this.passwordSalt) === this.passwordHash;
}

const User = new model("User", userSchema);

module.exports = User;
