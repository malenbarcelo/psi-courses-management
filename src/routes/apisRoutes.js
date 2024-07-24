const express = require('express')
const multer = require('multer')
const path = require('path')
const usersApisController = require('../controllers/usersApisController.js')
const apisCoursesController = require('../controllers/apisCoursesController.js')
const apisCoursesEventsController = require('../controllers/apisCoursesEventsController.js')
const apisEventsStudentsController = require('../controllers/apisEventsStudentsController.js')
const apisQuotaReservationsController = require('../controllers/apisQuotaReservationsController.js')
const router = express.Router()

//Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/files/studentsAssignation'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()    
      const fileExtension = path.extname(file.originalname)   
      const fileName = file.originalname.replace(fileExtension,'')      
      cb(null, 'fileAssignStudents' + uniqueSuffix + fileExtension)
    }
})

const upload = multer({storage: storage})

//users
router.get('/users',usersApisController.users)
router.get('/users/predict-last-names/:string',usersApisController.predictLastNames)
router.get('/users/predict-first-names/:string',usersApisController.predictFirstNames)
router.get('/users/predict-emails/:string',usersApisController.predictEmails)
router.post('/users/edit-user',usersApisController.editUser)
router.post('/users/restore-password',usersApisController.restorePassword)
router.post('/users/block-user',usersApisController.blockUser)

//companies
router.get('/companies',usersApisController.companies)
router.post('/companies/create-company',usersApisController.createCompanyProcess)

//users categories
router.get('/users-categories',usersApisController.usersCategories)

//courses
router.get('/courses',apisCoursesController.courses)
router.get('/courses/courses-events/:courseId',apisCoursesController.coursesEvents)
router.post('/courses/create-course',apisCoursesController.createCourse)
router.post('/courses/edit-course',apisCoursesController.editCourse)
router.post('/courses/create-event',apisCoursesController.createEvent)

//courses-events
router.get('/courses-events/events',apisCoursesEventsController.events)
router.get('/courses-events/company-events/:idCompany',apisCoursesEventsController.companyEvents)

//next-events
router.get('/courses/company-next-events/:idCompany',apisCoursesController.companyNextEvents)
router.post('/courses/next-events/reserve-quota',apisCoursesController.reserveQuota)
router.post('/courses/next-events/cancel-reservation',apisCoursesController.cancelReservation)
router.post('/courses/next-events/edit-reservation',apisCoursesController.editReservation)

//courses-quota-reservations
router.get('/company-reservations/:idCompany',apisCoursesController.companyReservations)
router.get('/quota-reservations/companies-per-course',apisQuotaReservationsController.companiesPerCourse)

//courses-events-students
router.get('/company-assigned-students/:companyId',apisEventsStudentsController.companyAssignedStudents)
router.get('/event-company-assigned-students/:companyId/:eventId',apisEventsStudentsController.eventCompanyAssignedStudents)
router.post('/update-assigned-students',apisEventsStudentsController.updateAssignedStudents)
router.get('/events-students/students-per-course',apisEventsStudentsController.studentsPerCourse)
router.post('/events-students/read-excel-file',upload.single('ueppFile'),apisEventsStudentsController.readExcelFile)




module.exports = router