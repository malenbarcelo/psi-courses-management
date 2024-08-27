const express = require('express')
const eventsController = require('../controllers/eventsController.js')
const eventsApisController = require('../controllers/eventsApisController.js')
const router = express.Router()

///Backend
router.get('/',eventsController.events)
router.get('/events-history',eventsController.eventsHistory)

///APIS
//events history
router.post('/events-history/get-data',eventsApisController.getEventsHistory)
router.get('/events-students/predict-students/:string',eventsApisController.predictStudents)
router.post('/events-history/download-data',eventsApisController.downloadData)




module.exports = router