const Subject   = require("../models/subject")
const Collection= require("../models/collection")
const Tag       = require("../models/tag")
const constant  = require("../config/constant");
const Lesson    = require("../models/lesson");

exports.create = async function(request, response){
    const { 
        parent, 
        icon, 
        name, 
        shortDescription, 
        description, 
        medias, 
        tags, 
        visibility, 
        entry 
    } = request.body;

    // check there are parent values
    if (parent.length < 1) {
        response.status(constant.ERR_STATUS.Bad_Request).json({
            err_code: constant.ERR_CODE.require_field_missing,
            msg: "Parent field should have value"
        });
        return
    }

    // check parent have already this subject
    var subject_already_exist = await isUniqueInParentOfSubject(parent, name)
    if (subject_already_exist) {
        response.status(constant.ERR_STATUS.Bad_Request).json({
            err_code: constant.ERR_CODE.subject_already_exist_in_parent,
            msg: "One of parents already has this lesson"
        });
        return
    }

    var subject = Subject()
    subject.parent = parent
    subject.icon = icon
    subject.name = name
    subject.shortDescription = shortDescription
    subject.description = description
    subject.medias = medias
    subject.tags = tags
    subject.visibility = visibility
    subject.entry = entry
    subject.rating = 0
    subject.ratingCount = 0
    subject.numberOfShares = 0
    subject.numberOfActivations = 0
    subject.numberOfCompletions = 0
    subject.createdBy = request.user._id

    // save subject document
    subject.save(async function (err) {
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
                        tag.type = "subject"
                        tag.save()
                    }
                })
                .catch(error => {})
            }

            response.json({
                err_code: constant.ERR_CODE.success,
                subject
            });
        }
    })
}

exports.update = function(request, response){
    const { 
        _id,
        parent, 
        icon, 
        name, 
        shortDescription, 
        description, 
        medias, 
        tags, 
        visibility, 
        entry 
    } = request.body;

    Subject.findById(_id, async function(err, subject) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            if (subject) {
                // check parent have already this subject
                var subject_already_exist = await isUniqueInParentOfSubject(parent, name, { _id: {$ne: subject._id}})
                if (subject_already_exist) {
                    response.status(constant.ERR_STATUS.Bad_Request).json({
                        err_code: constant.ERR_CODE.subject_already_exist_in_parent,
                        msg: "One of parents already has this lesson"
                    });
                    return
                }
                
                subject.parent = parent
                subject.icon = icon
                subject.name = name
                subject.shortDescription = shortDescription
                subject.description = description
                subject.medias = medias
                subject.tags = tags
                subject.visibility = visibility
                subject.entry = entry

                // save subject document
                subject.save(async function (err) {
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
                                    tag.type = "subject"
                                    tag.save()
                                }
                            })
                            .catch(error => {})
                        }

                        response.json({
                            err_code: constant.ERR_CODE.success,
                            subject
                        });
                    }
                })
            } else {
                response.json({
                    err_code: constant.ERR_CODE.subject_not_exist,
                    msg: "Subject is not exist"
                });
            }
            
        }
    });
}

exports.searchParent = function(request, response){
    const { query } = request.params;
    Collection.find({name: {$regex: query, $options: 'i'}}, 'name').sort({'name': "asc"}).limit(100).exec(async function(err, collections) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            var result = []
            collections.forEach(item => {
                result.push({type: "collection", collectionId: item._id, collectionName: item.name})
            });
            response.json({
                err_code: constant.ERR_CODE.success,
                parents : result
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
    if (sort == null) {
        sort = constant.Subject_Sort.Newest
    }

    switch (sort) {
        case constant.Subject_Sort.Most_Popular:
            break
        case constant.Subject_Sort.Most_Lesson:
            break
        case constant.Subject_Sort.Newest:
            sortField = {"createdAt" : -1}
            break
        case constant.Subject_Sort.Oldest:
            sortField = {"createdAt" : 1}
            break
        case constant.Subject_Sort.My_Teacher:
            break
        case constant.Subject_Sort.Highest_Avg:
            break
        case constant.Subject_Sort.Highest_Score:
            break
        case constant.Subject_Sort.Highest_Trans:
            break
    }

    var condition = {}
    if (query && query != "") {
        condition["name"] = {$regex: query, $options: 'i'}
    }
    if (parent) {
        condition["parent"] = parent
    }
    if (fields == null || fields == "") {
        fields = 'name rating shortDescription icon medias createdAt'
    }
    
    Subject.find(condition, fields, { sort: sortField}).limit(100).find(function(err, subjects) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: constant.ERR_CODE.success,
                subjects
            });
        }
    });
}

exports.detail = function(request, response){
    const { id } = request.params;
    
    Subject.findById(id, async function(err, subject) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            if (subject) {
                var parentArray = []
                for (var i = 0; i < subject.parent.length; i++) {
                    let item = subject.parent[i]
                    if (item.type == "subject") {
                        let psubject = await Subject.findById(item._id, "name")
                        if (psubject) {
                            parentArray.push({type: "subject", subjectId: psubject._id, subjectName: psubject.name})
                        }
                    } else if (item.type == "collection") {
                        let collection = await Collection.findById(item._id, "name")
                        if (collection) {
                            parentArray.push({type: "collection", collectionId: collection._id, collectionName: collection.name})
                        }
                    }
                }

                // find child lessons who have this subject as their parent
                var result = subject
                result.parent = parentArray

                Lesson.find({parent: {_id: id, type: "subject"}}).find(function(err, lessons) {
                    if (err != null) {
                        console.log("find children lesson return error")
                        response.json({
                            err_code: constant.ERR_CODE.success,
                            subject: result,
                            lessons: []
                        });
                    } else {
                        response.json({
                            err_code: constant.ERR_CODE.success,
                            subject: result,
                            lessons: lessons
                        });
                    }
                });
            } else {
                response.json({
                    err_code: constant.ERR_CODE.subject_not_exist,
                    msg: "Subject is not exist"
                });
            }
            
        }
    });
}

exports.deleteOne = function(request, response){
    const { id } = request.params;
    
    Subject.deleteOne({_id: id}, function(err) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: constant.ERR_CODE.success,
                msg: "Subject deleted successfully"
            });
        }
    });
}

isUniqueInParentOfSubject = async(parents, name, except = null) => {
    const promises = parents.map((item) => {
        return new Promise((resolve, reject) => {
            var condition = { parent: item, name: name }
            if (except) {
                condition = { parent: item, name: name, except }
            }
            Subject.findOne( condition, (err, subject) => {
                if (err) {
                    reject(false)
                } else {
                    if (subject) {
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