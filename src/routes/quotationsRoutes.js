const express = require('express')
const multer = require('multer')
const path = require('path')
const quotationsController = require('../controllers/quotationsController.js')
const quotationsApisController = require('../controllers/quotationsApisController.js')
const router = express.Router()

//Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/files/purchaseOrders'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()    
      const fileExtension = path.extname(file.originalname)   
      const fileName = file.originalname.replace(fileExtension,'')      
      cb(null, 'PO_' + uniqueSuffix + fileExtension)
    }
})

const upload = multer({storage: storage})

///Backend
router.get('/',quotationsController.quotations)
router.get('/quotes-history',quotationsController.quotesHistory)

///APIS
//quotations
router.get('/all-data',quotationsApisController.quotations)
router.get('/in-progress-quotations',quotationsApisController.inProgress)
router.get('/quotations-data',quotationsApisController.quotationsData)
router.get('/quotations-status',quotationsApisController.quotationsStatus)
router.post('/no-quotation-required',quotationsApisController.noQuotationRequired)
router.post('/save-quotation',quotationsApisController.saveQuotation)
router.post('/cancel-quotation',quotationsApisController.cancelQuotation)
router.post('/refuse-quotation',quotationsApisController.refuseQuotation)
router.post('/save-purchase-order',upload.single('uoppFile'),quotationsApisController.savePurchaseOrder)
router.post('/accept-quotation',quotationsApisController.acceptQuotation)
router.get('/quotations-status',quotationsApisController.quotationsStatus)

module.exports = router