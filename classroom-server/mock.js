const uuidv4 = require("uuid").v4;

const makeClassGenerator = () => {
    let id = 1;
    return (name) => ({ id: id++, name });
};

const makeClass = makeClassGenerator();

const makeUserGenerator = () => {
    let id = 1;
    return (username, password, name) => ({id: id++, username, password, name});
};

const makeUser = makeUserGenerator();

const makeSession = (mockUser) => ({userId: mockUser.id, token: uuidv4()});

const makeData = () => ({
    classes: [
        makeClass("First"),
        makeClass("Second")
    ],
    sessions: [],
    users: [
        makeUser("one", "test", "One"),
        makeUser("two", "test", "Two"),
        makeUser("three", "test", "Three")
    ],
    userClasses: [
        {userId: 1, classId: 1},
        {userId: 1, classId: 2},
        {userId: 2, classId: 1},
        {userId: 3, classId: 2}
    ]
});

module.exports = { makeData, makeSession };
