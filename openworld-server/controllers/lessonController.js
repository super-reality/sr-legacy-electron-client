const Lesson    = require("../models/lesson")
const Collection= require("../models/collection")
const Subject   = require("../models/subject")
const Step      = require("../models/step")
const Tag       = require("../models/tag")
const constant  = require("../config/constant")

exports.create = function(request, response){
    const { 
        parent,
        icon,
        name,
        shortDescription,
        description,
        difficulty,
        medias,
        tags,
        visibility,
        ownership,
        entry,
        steps
    } = request.body;

    var lesson = Lesson()
    lesson.parent = parent
    lesson.icon = icon
    lesson.name = name
    lesson.shortDescription = shortDescription
    lesson.description = description
    lesson.difficulty = difficulty
    lesson.medias = medias
    lesson.tags = tags
    lesson.visibility = visibility
    lesson.ownership = ownership
    lesson.entry = entry
    lesson.totalSteps = []
    lesson.rating = 0
    lesson.ratingCount = 0
    lesson.numberOfShares = 0
    lesson.numberOfActivations = 0
    lesson.numberOfCompletions = 0
    lesson.createdBy = request.user._id

    // save lesson document
    lesson.save(async function (err) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            // save tags to Tag table
            for (var i = 0; i < tags.length; i++){
                const tagName = tags[i]
                Tag.findOne({name: tagName})
                .then(result => {
                    if (result) {
                    } else {
                        var tag = Tag()
                        tag.name = tagName
                        tag.type = "lesson"
                        tag.save()
                    }
                })
                .catch(error => {})
            }

            // save steps to Step table
            var totalSteps = []
            for (var i = 0; i < steps.length; i++){
                if (steps[i]._id) {
                    totalSteps.push(steps[i]._id)
                } else {
                    var step = Step()
                    step.image = steps[i].image
                    step.imageFunction = steps[i].imageFunction
                    step.additionalFunctions = steps[i].additionalFunctions
                    step.name = steps[i].name
                    step.trigger = steps[i].trigger
                    step.description = steps[i].description
                    step.next = steps[i].next
                    step.createdBy = request.user._id

                    await step.save()
                    totalSteps.push(step._id)
                }
            }

            // update lesson's totalSteps to steps array
            lesson.totalSteps = totalSteps
            lesson.save(function (err) {
                if (err) {
                    response.status(constant.ERR_STATUS.Bad_Request).json({
                        error: err
                    });
                } else {
                    response.json({
                        err_code: constant.ERR_CODE.success,
                        lesson
                    });
                }
            });
        }
    })
}

exports.searchParent = function(request, response){
    const { query } = request.params;
    Subject.find({name: {$regex: query, $options: 'i'}}, 'name parent').sort({'name': "asc"}).limit(100).exec(async function(err, subjects) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            var result = []
            for (var i = 0; i < subjects.length; i++) {
                let curSubject = subjects[i]
                if (curSubject.parent) {
                    for (var j = 0; j < curSubject.parent.length; j++) {
                        let collection = await Collection.findById(curSubject.parent[j])
                        if (collection) {
                            result.push({type: "subject", collectionId: collection._id, collectionName: collection.name, subjectId:curSubject._id, subjectName: curSubject.name})
                        }
                    }
                }
            }            

            Lesson.find({name: {$regex: query, $options: 'i'}}, 'name parent').sort({'name': "asc"}).limit(100).exec(async function(err1, lessons) {
                if (err1 != null) {
                    response.status(constant.ERR_STATUS.Bad_Request).json({
                        error: err1
                    });
                } else {
                    for (var i = 0; i < lessons.length; i++) {
                        let curLesson = lessons[i]
                        if (curLesson.parent) {
                            for (var j = 0; j < curLesson.parent.length; j++) {
                                if (curLesson.parent[j].type == "subject") {
                                    let subject = await Subject.findById(curLesson.parent[j]._id)
                                    if (subject) {
                                        result.push({type: "lesson", subjectId: subject._id, subjectName: subject.name, lessonId:curLesson._id, lessonName: curLesson.name})
                                    }
                                }
                            }
                        }
                    }

                    response.json({
                        err_code: constant.ERR_CODE.success,
                        parents : result
                    });
                }
            });
        }
    });
}
