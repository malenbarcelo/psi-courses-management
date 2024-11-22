const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware.js')
const eventsController = require('../controllers/eventsController.js')
const eventsApisController = require('../controllers/eventsApisController.js')
const router = express.Router()

///Backend
router.get('/',authMiddleware, eventsController.events)

///APIS
//courses events
router.post('/delete-event',authMiddleware,eventsApisController.deleteEvent)
router.post('/download-events',authMiddleware,eventsApisController.downloadEvents)
router.post('/students/download-data',authMiddleware,eventsApisController.downloadStudents)

module.exports = router