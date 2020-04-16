const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.get("/", (request, response) => {
    try {
        const {authorization} = request.headers;
        const rawToken = /Bearer (.*)/.exec(authorization)[1];
        const issuer = process.env.JWT_ISSUER;
        const audience = process.env.JWT_AUDIENCE;
        const maxAge = process.env.JWT_EXPIRATION;
        jwt.verify(rawToken, process.env.JWT_SECRET, {issuer, audience, maxAge}, (error, result) => {
            if(error) {
                response.sendStatus(401);
            }
            else {
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
            }
        });
    }
    catch(exception) {
        response.sendStatus(400);
    }
});

module.exports = router;
