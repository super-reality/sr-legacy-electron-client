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
    Service_Unavailable: 503,
  },
  ERR_CODE: {
    success: 0,
    user_name_wrong: 101,
    user_password_wrong: 102,
    user_already_exist: 103,
    require_field_missing: 104,

    collection_already_exist: 201,

    lesson_already_exist_in_parent: 401,
  },

  Category: {
    All: 0,
    Lesson: 1,
    Subject: 2,
    Organization: 3,
    Collection: 4,
    Teacher: 5,
    Student: 6,
    JobPost: 7,
    Project: 8,
    Resource: 9,
    TeacherBot: 10,
  },
  Difficulty: {
    Intro: 1,
    Beginner: 2,
    Intermediate: 3,
    Advanced: 4,
  },
  Entry: {
    Open: 1,
    Invite: 2,
  },
  Image_Function: {
    Computer_Vision_On: 1,
    Computer_Vision_On_But_Visible: 2,
    Computer_Vision_Off: 3,
  },
  Image_Function_Additional: {
    And: 1,
    Or: 2,
    Ignore: 3,
  },
  Step_Trigger: {
    None: 0,
    On_Step_Loaded: 1,
    On_Focus_Detected: 2,
    On_Gaze_Detected: 3,
    On_Highlight_Clicked: 4,
  },
  Next_Step: {
    Press_Next_Step_Button: 1,
    On_Highlight_Clicked: 2,
    On_Text_Reading_Finished: 3,
  },

  Admin: 1,
  Client: 2,
});
