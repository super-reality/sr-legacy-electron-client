const Tag       = require("../models/tag")
const constant  = require("../config/constant")

exports.search = function(request, response){
    const { query } = request.params;
    
    Tag.find({name: {$regex: query, $options: 'i'}}, 'name').sort({'name': "asc"}).limit(20).exec(function(err, tags) {
        if (err != null) {
            response.status(constant.ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            var tagArray = []
            for (var i = 0; i < tags.length; i++) {
                tagArray.push(tags[i].name)
            }
            response.json({
                err_code: constant.ERR_CODE.success,
                tags : tagArray
            });
        }
    });
}
