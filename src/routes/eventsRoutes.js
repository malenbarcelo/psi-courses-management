const express = require('express')
const eventsController = require('../controllers/eventsController.js')
const eventsApisController = require('../controllers/eventsApisController.js')
const router = express.Router()

///Backend
router.get('/',eventsController.events)

///APIS
//courses events
router.post('/delete-event',eventsApisController.deleteEvent)
router.post('/download-events',eventsApisController.downloadEvents)
router.post('/students/download-data',eventsApisController.downloadStudents)

module.exports = router