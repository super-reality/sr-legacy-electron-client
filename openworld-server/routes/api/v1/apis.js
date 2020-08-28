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
const tagController        = require('../../../controllers/tagController')

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

// find
router.get("/find", collectionController.find)

// collection routes
router.group("/collection", (router) => {
    router.post("/create", auth(), collectionController.create)
    router.get("/list", auth(), collectionController.list)
})

// subject routes
router.group("/subject", (router) => {
    router.post("/create", auth(), subjectController.create)
    router.get("/search-parent/:query", auth(), subjectController.searchParent)
    // router.put("/update/:lesson_id", auth(), lessonController.list)
})

// lessons routes
router.group("/lesson", (router) => {
    router.post("/create", auth(), lessonController.create)
    router.get("/search-parent/:query", auth(), lessonController.searchParent)
    // router.put("/update/:lesson_id", auth(), lessonController.list)
})

// tag routes
router.group("/tag", (router) => {
    router.get("/search/:query", auth(), tagController.search)
})

module.exports = router
