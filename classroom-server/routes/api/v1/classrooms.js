const express = require("express");
const Classroom = require("../../../models/classroom");
const router = express.Router();

router.route("/")
    .get((request, response) => {
        Classroom
            .find()
            .then(classrooms => classrooms.map(classroom => ({id: classroom.id, name: classroom.name})))
            .then(classrooms => response.send({classrooms}))
            .catch(error => response.sendStatus(500));
    })
    .post((request, response) => {
        const {name} = request.body;
        const classroom = new Classroom({name});
        classroom
            .save()
            .then(classroom => ({id: classroom.id, name: classroom.name}))
            .then(classroom => response.send({classroom}))
            .catch(error => response.sendStatus(error ? error : 500));
    });

router.route("/:classroomId")
    .get((request, response) => {
        const {classroomId} = request.params;
        Classroom
            .findById(classroomId)
            .then(classroom => classroom ? classroom : Promise.reject({status: 404}))
            .then(classroom => ({id: classroom.id, name: classroom.name}))
            .then(classroom => response.send({classroom}))
            .catch(error => response.sendStatus(error.status ? error.status : 500));
    })
    .patch((request, response) => {
        const {classroomId} = request.params;
        Classroom
            .findById(classroomId)
            .then(classroom => classroom ? classroom : Promise.reject({status: 404}))
            .then(classroom => {
                const {name} = request.body;
                if(name) {
                    classroom.name = name;
                }
                return classroom;
            })
            .then(classroom => classroom.save())
            .then(classroom => ({id: classroom.id, name: classroom.name}))
            .then(classroom => response.send({classroom}))
            .catch(error => response.sendStatus(error.status ? error.status : 500));
    })
    .delete((request, response) => {
        const {classroomId} = request.params;
        Classroom
            .findById(classroomId)
            .then(classroom => classroom ? classroom : Promise.reject({status: 404}))
            .then(classroom => classroom.remove())
            .then(classroom => ({id: classroom.id, name: classroom.name}))
            .then(classroom => response.send({classroom}))
            .catch(error => response.sendStatus(error.status ? error.status : 500));
    });

module.exports = router;
