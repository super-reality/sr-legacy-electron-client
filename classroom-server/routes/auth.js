const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {hashSaltDigest} = require("../utilities/hashing");

const router = express.Router();

router.post("/new", (request, response) => {
    const {username, password} = request.body;
    User
        .findOne({username})
        .then(user => {
            if(user && user.username === username && user.passwordHash === hashSaltDigest(password, user.passwordSalt)) {
                const token = jwt.sign(
                    {},
                    process.env.JWT_SECRET,
                    {
                        subject: user.id.toString(),
                        issuer: process.env.JWT_ISSUER,
                        audience: process.env.JWT_AUDIENCE,
                        expiresIn: process.env.JWT_EXPIRATION
                    }
                );
                response.send({token});
            }
            else {
                response.sendStatus(401);
            }
        })
        .catch(error => {
            console.error(error);
            response.sendStatus(500);
        });
});

router.post("/verify", (request, response) => {
    try {
        const {authorization} = request.headers;
        const rawToken = /Bearer (.*)/.exec(authorization)[1];
        const issuer = process.env.JWT_ISSUER;
        const audience = process.env.JWT_AUDIENCE;
        const maxAge = process.env.JWT_EXPIRATION;
        jwt.verify(rawToken, process.env.JWT_SECRET, {issuer, audience, maxAge}, (error, result) => {
            response.sendStatus(error ? 401 : 200);
        });
    }
    catch(exception) {
        response.sendStatus(400);
    }
});

module.exports = router;
