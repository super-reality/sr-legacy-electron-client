const express = require("express")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const User = require("../models/user")
const { hashDigest, hashSaltDigest } = require("../utilities/hashing")
const constant = require("../config/constant")

exports.signin = function(request, response){
    const {
        username, 
        password
    } = request.body;

    User.findOne({username})
    .then(user => user ? user : response.status(constant.ERR_STATUS.Unauthorized).json({err_code: constant.ERR_CODE.user_name_wrong, msg: "Wrong username"}))
    .then(user => user.passwordHash === hashSaltDigest(password, user.passwordSalt) ? user : response.status(constant.ERR_STATUS.Unauthorized).json({salt: user.passwordSalt, hash: hashSaltDigest(password, user.passwordSalt),err_code: constant.ERR_CODE.user_password_wrong, msg: "Wrong password"}))
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
        response.send({err_code: constant.ERR_CODE.success, user : user, token: token})
    })
    .catch(error => response.status(constant.ERR_CODE.Internal_Server_Error).json({error: error.status ? error.status : 500}))
}

exports.signup = function(request, response){
    const {
        username, 
        password, 
        firstname, 
        lastname, 
        invitecode,
        age
    } = request.body;
    
    User.findOne({username})
    .then(user => {
        if (user) {
            response.status(constant.ERR_STATUS.Unauthorized).json({err_code: constant.ERR_CODE.user_already_exist, msg: "User already exist"})
        } else {
            var newUser = User()
            newUser.firstname = firstname
            newUser.lastname = lastname
            newUser.username = username
            newUser.invitecode = invitecode
            newUser.age = age
            newUser.passwordSalt = hashDigest(Date.now().toString())
            newUser.passwordHash = hashSaltDigest(password, newUser.passwordSalt)

            newUser.save(function (err) {
                if (err != null) {
                    response.status(constant.ERR_STATUS.Unauthorized).json({
                        error: err.status ? err.status : 500
                    });
                } else {
                    const token = jwt.sign(
                        {},
                        process.env.JWT_SECRET,
                        {
                            subject: newUser.id,
                            issuer: process.env.JWT_ISSUER,
                            audience: process.env.JWT_AUDIENCE,
                            expiresIn: process.env.JWT_EXPIRATION
                        }
                    );
                    response.json({
                        err_code: constant.ERR_CODE.success,
                        user: newUser,
                        token: token
                    });
                }
            });
        }
    })
    .catch(error => response.status(constant.ERR_CODE.Internal_Server_Error).json({error: error.status ? error.status : 500}))
}

exports.verify = function(request, response) {
    response.send({err_code: constant.ERR_CODE.success, user : request.user})
}