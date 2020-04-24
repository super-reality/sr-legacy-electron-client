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
    }
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
