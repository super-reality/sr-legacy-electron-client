const Lesson    = require("../models/lesson")
const Collection= require("../models/collection")
const Subject   = require("../models/subject")
const Step      = require("../models/step")
const Tag       = require("../models/tag")
const constant  = require("../config/constant")

const fileupload = require("../utilities/upload")
const path = require('path')

exports.create = async function(request, response){
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
    
    // check there are parent values
    if (parent.length < 1) {
        response.status(constant.ERR_STATUS.Bad_Request).json({
            err_code: constant.ERR_CODE.require_field_missing,
            msg: "Parent field should have value"
        });
        return
    }

    // check parent have already this lesson
    var lesson_already_exist = await isUniqueInParent(parent, name)
    if (lesson_already_exist) {
        response.status(constant.ERR_STATUS.Bad_Request).json({
            err_code: constant.ERR_CODE.lesson_already_exist_in_parent,
            msg: "One of parents already has this lesson"
        });
        return
    }

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
                    step.images = steps[i].images
                    step.functions = steps[i].functions
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

exports.createWithForm = async function(request, response){
    const { 
        parent,
        name,
        shortDescription,
        description,
        difficulty,
        tags,
        visibility,
        ownership,
        entry,
        steps
    } = request.body;

    const files = request.files
    const parentArray = JSON.parse(parent)
    const tagsObject = JSON.parse(tags)
    const visibilityObject = JSON.parse(visibility)
    const ownershipObject = JSON.parse(ownership)
    var stepsObject = JSON.parse(steps)
    
    // check there are parent values
    if (parentArray.length < 1) {
        response.status(constant.ERR_STATUS.Bad_Request).json({
            err_code: constant.ERR_CODE.require_field_missing,
            msg: "Parent field should have value"
        });
        return
    }

    // check parent have already this lesson
    var lesson_already_exist = await isUniqueInParent(parentArray, name)
    if (lesson_already_exist) {
        response.status(constant.ERR_STATUS.Bad_Request).json({
            err_code: constant.ERR_CODE.lesson_already_exist_in_parent,
            msg: "One of parents already has this lesson"
        });
        return
    }

    var lesson = Lesson()
    lesson.parent = parentArray
    // lesson.icon = icon
    lesson.name = name
    lesson.shortDescription = shortDescription
    lesson.description = description
    lesson.difficulty = difficulty
    // lesson.medias = medias
    lesson.tags = tagsObject
    lesson.visibility = visibilityObject
    lesson.ownership = ownershipObject
    lesson.entry = entry
    // lesson.totalSteps = []
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
            for (var i = 0; i < tagsObject.length; i++){
                const tagName = tagsObject[i]
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

            // save icon and media
            var mediaFiles = []
            var stepsFiles = []
            stepsObject.forEach(element => {
                stepsFiles.push([])
            });

            files.forEach(element => {
                if (element.fieldname == "icon") {
                    const key = 'lesson-icon-' + lesson._id + "-" + Date.now() + path.extname(element.originalname)
                    fileupload(element, key, (success, data) => {
                    })
                    lesson.icon = constant.S3_ENDPOINT + key
                } else if (element.fieldname == "medias") {
                    const key = 'lesson-media-' + lesson._id + "-" + Date.now() + path.extname(element.originalname)
                    fileupload(element, key, (success, data) => {
                    })
                    mediaFiles.push(constant.S3_ENDPOINT + key)
                } else if (element.fieldname.startsWith("step")) {
                    var index = element.fieldname.substring(5)
                    const key = 'lesson-step-' + lesson._id + "-" + index + "-" + Date.now() + path.extname(element.originalname)
                    fileupload(element, key, (success, data) => {
                    })
                    stepsFiles[index].push(constant.S3_ENDPOINT + key)
                }
            });

            lesson.medias = mediaFiles

            // save steps to Step table
            var totalSteps = []
            for (var i = 0; i < stepsObject.length; i++){
                if (stepsObject[i]._id) {
                    totalSteps.push(stepsObject[i]._id)
                } else {
                    var step = Step()
                    step.images = stepsFiles[i]
                    step.functions = stepsObject[i].functions
                    step.name = stepsObject[i].name
                    step.trigger = stepsObject[i].trigger
                    step.description = stepsObject[i].description
                    step.next = stepsObject[i].next
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

exports.search = function(request, response){
    var { 
        query,
        sort,
        parent,
        fields,
    } = request.body;

    var sortField = {"name" : 1}
    var difficulty = 0
    if (sort == null) {
        sort = constant.Lesson_Sort.Newest
    }

    switch (sort) {
        case constant.Lesson_Sort.Newest:
            sortField = {"createdAt" : -1}
            break
        case constant.Lesson_Sort.Oldest:
            sortField = {"createdAt" : 1}
            break
        case constant.Lesson_Sort.Highest_Avg:
            sortField = {"rating" : -1}
            break
        case constant.Lesson_Sort.Lowest_Avg:
            sortField = {"rating" : 1}
            break
        case constant.Lesson_Sort.Intro:
            difficulty = constant.Difficulty.Intro
            break
        case constant.Lesson_Sort.Beginner:
            difficulty = constant.Difficulty.Beginner
            break
        case constant.Lesson_Sort.Intermediate:
            difficulty = constant.Difficulty.Intermediate
            break
        case constant.Lesson_Sort.Advanced:
            difficulty = constant.Difficulty.Advanced
            break
    }

    var condition = {}
    if (query && query != "") {
        condition["name"] = {$regex: query, $options: 'i'}
    }
    if (difficulty) {
        condition["difficulty"] = difficulty
    }
    if (parent) {
        condition["parent"] = parent
    }
    if (fields == null || fields == "") {
        fields = 'name shortDescription icon medias rating createdAt'
    }
    
    Lesson.find(condition, fields, { sort: sortField}).limit(100).find(function(err, lessons) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: constant.ERR_CODE.success,
                lessons
            });
        }
    });
}

exports.detail = function(request, response){
    const { id } = request.params;
    Lesson.findById(id, async function(err, lesson) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            if (lesson) {
                var parentArray = []
                for (var i = 0; i < lesson.parent.length; i++) {
                    let item = lesson.parent[i]
                    if (item.type == "subject") {
                        let subject = await Subject.findById(item._id, "name")
                        if (subject) {
                            parentArray.push({type: "subject", subjectId: subject._id, subjectName: subject.name})
                        }
                    } else if (item.type == "lesson") {
                        let les = await Lesson.findById(item._id, "name")
                        if (les) {
                            parentArray.push({type: "lesson", lessonId: les._id, lessonName: les.name})
                        }
                    }
                }
                
                var steps = []
                for (var i = 0; i < lesson.totalSteps.length; i++) {
                    let step = await Step.findById(lesson.totalSteps[i])
                    if (step) {
                        steps.push(step)
                    }
                }
                var result = lesson

                result.parent = parentArray
                result.totalSteps = steps

                response.json({
                    err_code: constant.ERR_CODE.success,
                    lesson: result
                });
            } else {
                response.json({
                    err_code: constant.ERR_CODE.lesson_not_exist,
                    msg: "Lesson is not exist"
                });
            }
            
        }
    });
}

exports.deleteOne = function(request, response){
    const { id } = request.params;
    
    Lesson.deleteOne({_id: id}, function(err) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: constant.ERR_CODE.success,
                msg: "Lesson deleted successfully"
            });
        }
    });
}

isUniqueInParent = async(parents, name) => {
    const promises = parents.map((item) => {
        return new Promise((resolve, reject) => {
            Lesson.findOne( { parent: item, name: name }, (err, lesson) => {
                if (err) {
                    reject(false)
                } else {
                    if (lesson) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            })
        })
    })
    
    const results = await Promise.all(promises)
    console.log(results)
    if (results.includes(true)) {
        return true
    }
    return false
}