const express = require('express')
const coursesController = require('../controllers/coursesController.js')
const router = express.Router()

router.get('/',coursesController.courses)

module.exports = router