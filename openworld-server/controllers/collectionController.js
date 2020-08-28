// 'user strict';

const Collection    = require('../models/collection')
const Subject       = require('../models/subject')
const collection        = require('../models/collection')
const Step          = require('../models/task')
const Tag           = require("../models/tag")

const constant = require('../config/constant')

exports.create = function(request, response){
    const { 
        icon, 
        name, 
        shortDescription, 
        description, 
        medias, 
        tags, 
        visibility, 
        entry
    } = request.body;

    Collection.findOne({name})
    .then(res => {
        if (res) {
            response.json({err_code: constant.ERR_CODE.collection_already_exist, msg: "Collection already exist"})
        } else {
            var collection = Collection()
            collection.icon = icon
            collection.name = name
            collection.shortDescription = shortDescription
            collection.description = description
            collection.medias = medias
            collection.tags = tags
            collection.visibility = visibility
            collection.entry = entry
            collection.rating = 0
            collection.ratingCount = 0
            collection.numberOfShares = 0
            collection.numberOfActivations = 0
            collection.numberOfCompletions = 0
            collection.createdBy = request.user._id

            // save collection document
            collection.save(function (err) {
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
                                tag.type = "collection"
                                tag.save()
                            }
                        })
                        .catch(error => {})
                    }

                    response.json({
                        err_code: constant.ERR_CODE.success,
                        collection
                    })
                }
            })
        }
    })
    .catch(error => response.status(constant.ERR_CODE.Internal_Server_Error).json({error: error.status ? error.status : 500}))
}


exports.find = function(request, response){
    const { search, category } = request.query

    if (category == null || category == constant.Category.All) {

    } else if (category == constant.Category.collection) {
        

    } else if (category == constant.Category.Subject) {

    } else if (category == constant.Category.Organization) {

    } else if (category == constant.Category.Collection) {

    } else if (category == constant.Category.Teacher) {

    } else if (category == constant.Category.Student) {

    } else if (category == constant.Category.JobPost) {

    } else if (category == constant.Category.Project) {

    } else if (category == constant.Category.Resource) {

    } else if (category == constant.Category.TeacherBot) {

    }
    
    if (search == null || search == "") {

    } else {

    }
    response.json({ search, category })
    // eventModel.getEventByEventId(eventid, function(err, result){
    //   if (err) {
    //     console.log("error ocurred",err);
    //     return res.json({
    //       success: false,
    //       msg: err.message,
    //       code: constants.ErrorCode
    //     })
    //   } else {
    //     if(result.length>0){
    //       return res.json({
    //         success: true,
    //         msg: 'Success',
    //         code: constants.SuccessCode,
    //         result: result[0]
    //       });
    //     } else {
    //       return res.json({
    //         success: false,
    //         msg: 'There is no Event',
    //         code: constants.NoRecodeError,
    //       });
    //     }
    //   }
    //   console.log('success', result);
    // });
}

exports.list = function(request, response){
    const { query } = request.query;
    response.json({query})
}