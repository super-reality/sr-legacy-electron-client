// 'user strict';

const collectionModel = require('../models/collection');
const subjectModel = require('../models/subject');
const lessonModel = require('../models/lesson');
const stepModel = require('../models/step');

const constant = require('../config/constant')

exports.find = function(request, response){
    const { search, category } = request.query

    if (category == null || category == constant.Category.All) {

    } else if (category == constant.Category.Lesson) {
        

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