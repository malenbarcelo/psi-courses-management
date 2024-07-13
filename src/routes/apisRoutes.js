const express = require('express')
const usersApisController = require('../controllers/usersApisController.js')
const coursesApisController = require('../controllers/coursesApisController.js')
const router = express.Router()

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
router.get('/courses',coursesApisController.courses)
router.get('/courses/courses-events/:courseId',coursesApisController.coursesEvents)
router.post('/courses/create-course',coursesApisController.createCourse)
router.post('/courses/create-event',coursesApisController.createEvent)

//next-events
router.get('/courses/company-next-events/:idCompany',coursesApisController.companyNextEvents)
router.post('/courses/next-events/reserve-quota',coursesApisController.reserveQuota)
router.post('/courses/next-events/cancel-reservation',coursesApisController.cancelReservation)


module.exports = router