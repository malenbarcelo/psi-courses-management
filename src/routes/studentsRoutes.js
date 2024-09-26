const express = require('express')
const studentsController = require('../controllers/studentsController.js')
const router = express.Router()

///Backend
router.get('/',studentsController.students)

///APIS
router.get('/students-data',studentsController.getData)
router.get('/predict-students/:string',studentsController.predictStudents)
router.post('/download-students',studentsController.downloadStudents)




module.exports = router