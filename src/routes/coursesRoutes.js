const express = require('express')
const admMiddleware = require('../middlewares/admMiddleware.js')
const coursesController = require('../controllers/coursesController.js')
const router = express.Router()

router.get('/',admMiddleware,coursesController.courses)

module.exports = router