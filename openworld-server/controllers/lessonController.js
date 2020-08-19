const Lesson    = require("../models/lesson")
const Step      = require("../models/step")
const Tag       = require("../models/tag")
const constant  = require("../config/constant")

exports.create = function(request, response){
    const { 
        subjectId, 
        icon, 
        name, 
        shortDescription, 
        description, 
        medias, 
        tags, 
        visibility, 
        entry, 
        steps 
    } = request.body;

    var lesson = Lesson()
    lesson.subjectId = subjectId
    lesson.icon = icon
    lesson.name = name
    lesson.shortDescription = shortDescription
    lesson.description = description
    lesson.medias = medias
    lesson.tags = tags
    lesson.visibility = visibility
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
                    step.icon = steps[i].icon
                    step.name = steps[i].name
                    step.description = steps[i].description
                    step.imageFunctions = steps[i].imageFunctions
                    step.trigger = steps[i].trigger
                    step.action = steps[i].action
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
