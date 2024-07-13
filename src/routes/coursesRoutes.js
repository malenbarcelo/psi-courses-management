const express = require('express')
const coursesController = require('../controllers/coursesController.js')
const router = express.Router()

router.get('/',coursesController.courses)
router.get('/next-events',coursesController.nextEvents)

module.exports = router