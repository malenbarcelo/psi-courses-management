const express = require('express')
const usersController = require('../controllers/usersController.js')
const usersApisController = require('../controllers/usersApisController.js')
const router = express.Router()

///BACKEND
router.get('/',usersController.users)
router.post('/create-user',usersController.createUserProcess)

///APIS
//users
router.get('/get-users',usersApisController.users)
router.get('/get-users-to-share',usersApisController.usersToShare)
router.get('/predict-last-names/:string',usersApisController.predictLastNames)
router.get('/predict-first-names/:string',usersApisController.predictFirstNames)
router.get('/predict-emails/:string',usersApisController.predictEmails)
router.post('/edit-user',usersApisController.editUser)
router.post('/restore-password',usersApisController.restorePassword)
router.post('/block-user',usersApisController.blockUser)
router.post('/block-company',usersApisController.blockCompany)
router.post('/psw-validation',usersApisController.pswValidation)
router.post('/change-password',usersApisController.changePassword)

//companies
router.get('/companies',usersApisController.companies)
router.post('/companies/create-company',usersApisController.createCompany)
router.post('/companies/edit-company',usersApisController.editCompany)

module.exports = router