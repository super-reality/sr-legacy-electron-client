const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const jwtVerify = promisify(jwt.verify);

const getJwtFromRequest = request => /Bearer (.*)/.exec(request.headers.authorization)[1];

const authenticateUser = token => new Promise((resolve, reject) => {
    try {
        const issuer = process.env.JWT_ISSUER;
        const audience = process.env.JWT_AUDIENCE;
        const maxAge = process.env.JWT_EXPIRATION;
        jwtVerify(token, process.env.JWT_SECRET, {issuer, audience, maxAge})
            .then(result => result.sub)
            .then(userId => User.findById(userId))
            .then(user => user ? Promise.resolve(user) : Promise.reject())
            .then(user => resolve(user))
            .catch(error => reject(error));
    }
    catch(exception) {
        reject(exception);
    }
});

const authorizePermissions = (user, permissions) => new Promise((resolve, reject) => resolve());

const auth = (permissions = []) => (request, response, next) => {
    try {
        authenticateUser(getJwtFromRequest(request))
            .then(user => authorizePermissions(user, permissions))
            .then(() => next())
            .catch(error => response.sendStatus(401))
    }
    catch(exception) {
        response.sendStatus(400);
    }
};

module.exports = auth;
