require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);

const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const User = require("./models/user");

const {hashDigest, hashSaltDigest} = require("./utilities/hashing");

app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));

database.once("open", () => {
    console.log("database connected");
    User
        .findOne({root: true})
        .then(user => {
            const username = process.env.ROOT_USERNAME;
            const passwordSalt = hashDigest(Date.now().toString());
            const passwordHash = hashSaltDigest(process.env.ROOT_PASSWORD, passwordSalt);
            if(user) {
                console.log("updating root user");
                user.username = username;
                user.passwordSalt = passwordSalt;
                user.passwordHash = passwordHash;
                return user.save();
            }
            else {
                console.log("creating root user");
                const newRootUser = new User({root: true, username, passwordSalt, passwordHash});
                return newRootUser.save();
            }
        })
        .then(user => {
            const port = process.env.PORT;
            server.listen(port, () => console.log(`listening on port ${port}`));
        })
        .catch(error => {
            console.error(`couldn't configure root user`);
        });
});

database.on("error", () => console.error("database connection error"));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
