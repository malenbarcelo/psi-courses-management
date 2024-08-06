const express = require('express')
const quotationsController = require('../controllers/quotationsController.js')
const quotationsApisController = require('../controllers/quotationsApisController.js')
const router = express.Router()

///Backend
router.get('/',quotationsController.quotations)

///APIS
//quotations
router.get('/in-progress-quotations',quotationsApisController.inProgressQuotations)
router.get('/quotations-data',quotationsApisController.quotationsData)
router.post('/no-quotation-required',quotationsApisController.noQuotationRequired)

module.exports = router