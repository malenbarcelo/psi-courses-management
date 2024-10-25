const express = require('express')
const mainController = require('../controllers/mainController.js')
const loginValidations = require('../validations/loginValidations.js')
const router = express.Router()

router.get('/',mainController.login)
router.get('/customers',mainController.customers)
router.post('/login',loginValidations.login,mainController.loginProcess)
router.get('/logout',mainController.logout)

module.exports = router