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
    router.get("/list", collectionController.list)
})

// router.get('/users', auth(), userController.signup);
// app.use("/api/v1/users", auth(), require("./routes/api/v1/users"));

module.exports = router
