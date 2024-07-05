const express = require('express')
const usersApisController = require('../controllers/usersApisController.js')
const router = express.Router()

router.get('/users',usersApisController.users)
router.get('/users/predict-last-names/:string',usersApisController.predictLastNames)
router.get('/users/predict-first-names/:string',usersApisController.predictFirstNames)
router.get('/users/predict-emails/:string',usersApisController.predictEmails)
router.post('/users/edit-user',usersApisController.editUser)
router.post('/users/restore-password',usersApisController.restorePassword)
router.post('/users/block-user',usersApisController.blockUser)



router.get('/companies',usersApisController.companies)
router.get('/users-categories',usersApisController.usersCategories)

module.exports = router