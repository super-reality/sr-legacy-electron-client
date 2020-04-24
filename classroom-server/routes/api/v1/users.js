const express = require("express");
const User = require("../../../models/user");
const auth = require("../../../middleware/auth");

const router = express.Router();

router.get("/", auth(), (request, response) => {
    User
        .find()
        .select("_id root username")
        .map(users => users.map(user => ({id: user._id, root: user.root, username: user.username})))
        .then(users => {
            response.send({users});
        })
        .catch(error => {
            response.sendStatus(500);
        });
});

module.exports = router;
