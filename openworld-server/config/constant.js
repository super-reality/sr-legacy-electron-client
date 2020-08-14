module.exports = Object.freeze({
    Category : {
        All : 0,
        Lesson : 1,
        Subject : 2,
        Organization : 3,
        Collection : 4,
        Teacher : 5,
        Student : 6,
        JobPost : 7,
        Project : 8,
        Resource : 9,
        TeacherBot : 10,
    },
    ERR_STATUS: {
        Bad_Request: 400,
        Unauthorized: 401,
        Forbidden: 403,
        Not_Found: 404,
        Method_Not_Allowed: 405,
        Not_Acceptable: 406,
        Request_Timeout: 408,
        Unsupported_Media_Type: 415,
        Unavailable_For_Legal_Reasons: 451,
        Internal_Server_Error: 500,
        Not_Implemented: 501,
        Service_Unavailable: 503
    },
    ERR_CODE: {
        success: 0,
        user_name_wrong: 101,
        user_password_wrong: 102,
        user_already_exist: 103,
    },

    Admin: 1,
    Client: 2,
});