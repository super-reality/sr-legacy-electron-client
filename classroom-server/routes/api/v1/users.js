const express = require("express");
const User = require("../../../models/user");
const router = express.Router();

router.route("/")
    .get((request, response) => {
        User
            .find()
            .then(users => users.map(user => ({id: user.id, root: user.root, username: user.username})))
            .then(users => response.send({users}))
            .catch(error => response.sendStatus(500));
    })
    .post((request, response) => {
        const {username, password} = request.body;
        User
            .findOne({username})
            .then(user => {
                if(user) {
                    return Promise.reject(400);
                }
            })
            .then(() => {
                if(username && password) {
                    const user = new User({root: false, username});
                    user.setPassword(password);
                    return user.save();
                }
                else {
                    return Promise.reject(400);
                }
            })
            .then(user => ({id: user.id, root: user.root, username: user.username}))
            .then(user => response.send({user}))
            .catch(error => response.sendStatus(error ? error : 500));
    });

router.route("/:userId")
    .get((request, response) => {
        const {userId} = request.params;
        User
            .findById(userId)
            .then(user => user ? user : Promise.reject({status: 404}))
            .then(user => ({id: user.id, root: user.root, username: user.username}))
            .then(user => response.send({user}))
            .catch(error => response.sendStatus(error.status ? error.status : 500));
    })
    .patch((request, response) => {
        const {userId} = request.params;
        User
            .findById(userId)
            .then(user => user ? user : Promise.reject({status: 404}))
            .then(user => !user.root ? user : Promise.reject({status: 403}))
            .then(user => {
                const {username} = request.body;
                if(username) {
                    return User
                        .findOne({username})
                        .then(existingUserWithUsername => {
                            if(existingUserWithUsername && existingUserWithUsername.id !== user.id) {
                                return Promise.reject({status: 400});
                            }
                        })
                        .then(() => {
                            user.username = username;
                            return user;
                        });
                }
                return user;
            })
            .then(user => {
                const {password} = request.body;
                if(password) {
                    user.setPassword(password);
                }
                return user;
            })
            .then(user => user.save())
            .then(user => ({id: user.id, root: user.root, username: user.username}))
            .then(user => response.send({user}))
            .catch(error => response.sendStatus(error.status ? error.status : 500));
    })
    .delete((request, response) => {
        const {userId} = request.params;
        User
            .findById(userId)
            .then(user => user ? user : Promise.reject({status: 404}))
            .then(user => !user.root ? user : Promise.reject({status: 403}))
            .then(user => user.remove())
            .then(user => ({id: user.id, root: user.root, username: user.username}))
            .then(user => response.send({user}))
            .catch(error => response.sendStatus(error.status ? error.status : 500));
    });

module.exports = router;
