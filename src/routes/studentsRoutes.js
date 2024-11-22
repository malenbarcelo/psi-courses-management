const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware.js')
const studentsController = require('../controllers/studentsController.js')
const router = express.Router()

///Backend
router.get('/',authMiddleware,studentsController.students)

///APIS
router.get('/students-data',authMiddleware,studentsController.getData)
router.get('/predict-students/:string',authMiddleware,studentsController.predictStudents)
router.post('/download-students',authMiddleware,studentsController.downloadStudents)




module.exports = router