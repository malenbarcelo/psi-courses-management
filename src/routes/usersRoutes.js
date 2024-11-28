const express = require('express')
const admMiddleware = require('../middlewares/admMiddleware.js')
const authMiddleware = require('../middlewares/authMiddleware.js')
const usersController = require('../controllers/usersController.js')
const usersApisController = require('../controllers/usersApisController.js')
const router = express.Router()

///BACKEND
router.get('/',admMiddleware, usersController.users)
router.post('/create-user',admMiddleware, usersController.createUserProcess)

///APIS
//users
router.get('/get-users', usersApisController.users)
router.get('/get-all-users', usersApisController.allUsers) //withous bearer
router.get('/get-users-to-share',usersApisController.usersToShare)
router.get('/predict-last-names/:string',admMiddleware,usersApisController.predictLastNames)
router.get('/predict-first-names/:string',admMiddleware,usersApisController.predictFirstNames)
router.get('/predict-emails/:string',admMiddleware,usersApisController.predictEmails)
router.post('/edit-user',admMiddleware,usersApisController.editUser)
router.post('/restore-password',usersApisController.restorePassword)
router.post('/block-user',admMiddleware,usersApisController.blockUser)
router.post('/block-company',admMiddleware,usersApisController.blockCompany)
router.post('/psw-validation',usersApisController.pswValidation)
router.post('/change-password',usersApisController.changePassword)

//companies
router.get('/companies',authMiddleware,usersApisController.companies)
router.post('/companies/create-company',admMiddleware, usersApisController.createCompany)
router.post('/companies/edit-company',admMiddleware, usersApisController.editCompany)

module.exports = router