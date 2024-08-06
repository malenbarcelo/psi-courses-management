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

//courses-events
router.get('/courses-events/events',apisCoursesEventsController.events)
router.get('/courses-events/company-events/:idCompany',apisCoursesEventsController.companyEvents)
router.post('/courses-events/create-event',apisCoursesEventsController.createEvent)
router.post('/courses-events/edit-event',apisCoursesEventsController.editEvent)

//courses-quota-reservations
router.get('/quota-reservations/companies-per-course',apisQuotaReservationsController.companiesPerCourse)
router.get('/quota-reservations/reservations-per-event-company',apisQuotaReservationsController.reservationsPerEventCompany)
router.post('/quota-reservations/reserve-quota',apisQuotaReservationsController.reserveQuota)
router.post('/quota-reservations/edit-reservation',apisQuotaReservationsController.editReservation)
router.post('/quota-reservations/cancel-reservation',apisQuotaReservationsController.cancelReservation)

//next-events
router.get('/courses/company-next-events/:idCompany',apisCoursesController.companyNextEvents)
router.get('/company-reservations/:idCompany',apisCoursesController.companyReservations)


//courses-events-students
router.get('/company-assigned-students/:companyId',apisEventsStudentsController.companyAssignedStudents)
router.get('/event-company-assigned-students/:companyId/:eventId',apisEventsStudentsController.eventCompanyAssignedStudents)
router.post('/update-assigned-students',apisEventsStudentsController.updateAssignedStudents)
router.get('/events-students/students-per-course',apisEventsStudentsController.studentsPerCourse)
router.post('/events-students/read-excel-file',upload.single('ueppFile'),apisEventsStudentsController.readExcelFile)




module.exports = router