const express = require('express')
const coursesController = require('../controllers/coursesController.js')
const router = express.Router()

router.get('/',coursesController.courses)
router.get('/events',coursesController.events)

module.exports = router