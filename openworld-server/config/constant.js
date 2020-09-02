module.exports = Object.freeze({
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
        require_field_missing: 104,

        collection_already_exist: 201,

        subject_already_exist_in_parent: 301,
        subject_not_exist: 302,

        lesson_already_exist_in_parent: 401,
        lesson_not_exist: 402,
    },

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
    Difficulty : {
        Intro: 1,
        Beginner : 2,
        Intermediate : 3,
        Advanced : 4,
    },
    Entry: {
        Open: 1,
        Invite: 2
    },
    Image_Function: {
        Computer_Vision_On : 1,
        Computer_Vision_On_But_Visible : 2,
        Computer_Vision_Off : 3,
    },
    Image_Function_Additional: {
        And : 1,
        Or : 2,
        Ignore : 3,
    },
    Step_Trigger: {
        None : 0,
        On_Step_Loaded : 1,
        On_Focus_Detected : 2,
        On_Gaze_Detected : 3,
        On_Highlight_Clicked : 4,
    },
    Next_Step: {
        Press_Next_Step_Button: 1,
        On_Highlight_Clicked: 2,
        On_Text_Reading_Finished: 3,
    },
    Lesson_Sort: {
        Newest:         1,
        Oldest:         2,
        Highest_Avg:    3,
        Lowest_Avg:     4,
        Intro:          5,
        Beginner:       6,
        Intermediate:   7,
        Advanced:       8,
    },
    Subject_Sort: {
        Most_Popular:   1,
        Most_Lesson:    2,
        Newest:         3,
        Oldest:         4,
        My_Teacher:     5,
        Highest_Avg:    6,
        Highest_Score:  7,
        Highest_Trans:  8,
    },

    Admin: 1,
    Client: 2,

    S3_ENDPOINT : (process.env.S3_ENDPOINT ? process.env.S3_ENDPOINT : "https://s3.us-west-1.amazonaws.com/openverse-lms/"),
});