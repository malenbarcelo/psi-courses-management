const express = require('express')
const usersController = require('../controllers/usersController.js')
const router = express.Router()

router.get('/',usersController.users)

module.exports = router