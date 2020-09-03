var express = require('express')
require('express-group-routes')
var router = express.Router()
const auth = require("../../../middleware/auth")

const authController        = require('../../../controllers/authController')
const userController        = require('../../../controllers/userController')
const collectionController  = require('../../../controllers/collectionController')
const subjectController     = require('../../../controllers/subjectController')
const lessonController      = require('../../../controllers/lessonController')
const stepController        = require('../../../controllers/stepController')
const tagController         = require('../../../controllers/tagController')
const fileController        = require('../../../controllers/fileController')

const multer  = require('multer');
const fileParser  = multer({ storage: multer.memoryStorage() });

// full route "/v1/api"
router.get('/', function (req, res) {
    res.json({
        status: 'Welcome to Open World API',
        message: 'Open World Rest Api is now working!',
    })
})

// auth routes
router.group("/auth", (router) => {
    router.post("/signin", authController.signin)
    router.post("/signup", authController.signup)
    
    router.post("/verify", auth(), authController.verify)
})

// user routes
router.group("/user", (router) => {

    // book lesson
    router.post("/book-lesson", auth(), userController.bookLesson)
})

// find
router.get("/find", collectionController.find)

// collection routes
router.group("/collection", (router) => {
    router.post("/create", auth(), collectionController.create)
    router.get("/list", auth(), collectionController.list)
    router.post("/search", auth(), collectionController.search)
    router.get("/:id", auth(), collectionController.detail)
    router.delete("/:id", auth(), collectionController.deleteOne)
})

// subject routes
router.group("/subject", (router) => {
    router.post("/create", auth(), subjectController.create)
    router.get("/search-parent/:query", auth(), subjectController.searchParent)
    router.post("/search", auth(), subjectController.search)
    router.get("/:id", auth(), subjectController.detail)
    router.delete("/:id", auth(), subjectController.deleteOne)
})

// lessons routes
router.group("/lesson", (router) => {
    router.post("/create", auth(), lessonController.create)
    router.post("/createWithForm", [auth(), fileParser.any()], lessonController.createWithForm)
    router.get("/search-parent/:query", auth(), lessonController.searchParent)

    router.post("/search", auth(), lessonController.search)
    router.get("/:id", auth(), lessonController.detail)
    router.delete("/:id", auth(), lessonController.deleteOne)
    // router.put("/update/:lesson_id", auth(), lessonController.list)
})

// tag routes
router.group("/tag", (router) => {
    router.get("/search/:query", auth(), tagController.search)
})

// file routes
router.group("/file", (router) => {
    router.post("/upload", [auth(), fileParser.any()], fileController.upload)
})

module.exports = router
