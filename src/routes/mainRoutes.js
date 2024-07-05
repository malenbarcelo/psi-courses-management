const express = require('express')
const mainController = require('../controllers/mainController.js')
//const userFormsValidations = require('../validations/userFormsValidations.js')
const router = express.Router()

router.get('/',mainController.login)
router.post('/login',mainController.loginProcess)

module.exports = router