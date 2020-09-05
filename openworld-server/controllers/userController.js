// 'user strict';

const Favor         = require("../models/favor")
const constant      = require('../config/constant')

exports.bookLesson = function(request, response){
    const { lessonId, book } = request.body;
    const userId = request.user._id
    
    Favor.findOne({user: userId})
        .then(result => {
            if (result) {
                if (book == null || book == true) {
                    if (!result.lessons.includes(lessonId)) {
                        result.lessons.push(lessonId)
                    }
                    result.save()
                    response.json({
                        err_code: constant.ERR_CODE.success,
                        msg: "Lesson is booked successfully"
                    });
                } else {
                    if (result.lessons.includes(lessonId)) {
                        result.lessons.splice(result.lessons.indexOf(lessonId), 1)
                    }
                    result.save()
                    response.json({
                        err_code: constant.ERR_CODE.success,
                        msg: "Lesson is unbooked successfully"
                    });
                }
            } else {
                if (book == null || book == true) {
                    // create favor document
                    var favor = Favor()
                    favor.user = userId
                    favor.lessons = [lessonId]
                    favor.save()
                    response.json({
                        err_code: constant.ERR_CODE.success,
                        msg: "Lesson is booked successfully"
                    });
                } else {
                    response.json({
                        err_code: constant.ERR_CODE.user_not_booked_lesson,
                        msg: "Invalid request"
                    });
                }
            }
        })
}