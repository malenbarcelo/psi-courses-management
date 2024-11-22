const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware.js')
const admMiddleware = require('../middlewares/admMiddleware.js')
const companyLoggedMiddleware = require('../middlewares/companyLoggedMiddleware.js')
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

//users categories
router.get('/users-categories',authMiddleware,usersApisController.usersCategories)

//courses
router.get('/courses',authMiddleware,apisCoursesController.courses)
router.get('/courses/courses-events/:courseId',authMiddleware,apisCoursesController.coursesEvents)
router.post('/courses/create-course',admMiddleware,apisCoursesController.createCourse)
router.post('/courses/edit-course',admMiddleware,apisCoursesController.editCourse)

//courses-events
router.get('/courses-events/events',authMiddleware,apisCoursesEventsController.events)
router.get('/courses-events/next-events',authMiddleware,apisCoursesEventsController.nextEvents)
router.get('/courses-events/company-events/:idCompany',companyLoggedMiddleware,apisCoursesEventsController.companyEvents)
router.get('/courses-events/company-next-events/:idCompany',companyLoggedMiddleware,apisCoursesEventsController.companyNextEvents)
router.post('/courses-events/create-event',admMiddleware,apisCoursesEventsController.createEvent)
router.post('/courses-events/edit-event',admMiddleware,apisCoursesEventsController.editEvent)

//courses-quota-reservations
router.get('/quota-reservations/companies-per-course',authMiddleware,apisQuotaReservationsController.companiesPerCourse)
router.get('/quota-reservations/reservations-per-event-company',authMiddleware,apisQuotaReservationsController.reservationsPerEventCompany)
router.post('/quota-reservations/reserve-quota',authMiddleware,apisQuotaReservationsController.reserveQuota)
router.post('/quota-reservations/edit-reservation',authMiddleware,apisQuotaReservationsController.editReservation)
router.post('/quota-reservations/cancel-reservation',authMiddleware,apisQuotaReservationsController.cancelReservation)

//next-events
router.get('/courses/company-next-events/:idCompany',companyLoggedMiddleware,apisCoursesController.companyNextEvents)
router.get('/company-reservations/:idCompany',companyLoggedMiddleware,apisCoursesController.companyReservations)


//courses-events-students
router.get('/company-assigned-students/:companyId',companyLoggedMiddleware,apisEventsStudentsController.companyAssignedStudents)
router.get('/event-company-assigned-students/:idCompany/:eventId',companyLoggedMiddleware,apisEventsStudentsController.eventCompanyAssignedStudents)
router.post('/update-assigned-students',authMiddleware,apisEventsStudentsController.updateAssignedStudents)
router.get('/events-students/students-per-course',authMiddleware,apisEventsStudentsController.studentsPerCourse)
router.post('/events-students/read-excel-file',authMiddleware,upload.single('ueppFile'),apisEventsStudentsController.readExcelFile)




module.exports = router