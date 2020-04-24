const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const {hashSaltDigest} = require("../../../utilities/hashing");

const router = express.Router();

router.post("/new", (request, response) => {
    const {username, password} = request.body;
    User
        .findOne({username})
        .then(user => user ? user : Promise.reject({status: 401}))
        .then(user => user.username === username ? user : Promise.reject({status: 401}))
        .then(user => user.passwordHash === hashSaltDigest(password, user.passwordSalt) ? user : Promise.reject({status: 401}))
        .then(user => {
            const token = jwt.sign(
                {},
                process.env.JWT_SECRET,
                {
                    subject: user.id,
                    issuer: process.env.JWT_ISSUER,
                    audience: process.env.JWT_AUDIENCE,
                    expiresIn: process.env.JWT_EXPIRATION
                }
            );
            response.send({token});
        })
        .catch(error => response.sendStatus(error.status ? error.status : 500));
});

module.exports = router;
