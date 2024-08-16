
const qecQueries = require('./dbQueries/quotationsEventsCompaniesQueries')
const quotationsQueries = require('./dbQueries/quotationsQueries')
const quotationsDetailsQueries = require('./dbQueries/quotationsDetailsQueries')
const quotationsStatusQueries = require('./dbQueries/quotationsStatusQueries')
const qpoQueries = require('./dbQueries/quotationsPurchaseOrdersQueries')

const quotationsApisController = {
  quotations: async(req,res) =>{
    try{

      const idUsersCategories = req.session.userLogged.id_users_categories
      let quotations

      if (idUsersCategories != 4) {
        quotations = await quotationsQueries.quotations()
      }else{
        const idCompany = req.session.userLogged.id_companies
        quotations = await quotationsQueries.companyQuotations(idCompany)
      }

      res.status(200).json(quotations)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
    inProgress: async(req,res) =>{
      try{

        const idUsersCategories = req.session.userLogged.id_users_categories
        let inProgress = []

        if (idUsersCategories != 4) {
          inProgress = await qecQueries.inProgress()
        }else{
          const idCompany = req.session.userLogged.id_companies
          inProgress = await qecQueries.companyInProgress(idCompany)
        }
  
        res.status(200).json(inProgress)
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    noQuotationRequired: async(req,res) =>{
      try{
  
        const data = req.body

        await qecQueries.noQuotationRequired(data.id)
  
        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    quotationsData: async(req,res) =>{
      try{
  
        const allData = await quotationsQueries.quotations()
  
        res.status(200).json(allData)
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    quotationsStatus: async(req,res) =>{
      try{
  
        const allData = await quotationsStatusQueries.allData()
  
        res.status(200).json(allData)
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    saveQuotation: async(req,res) =>{
      try{

        let idQuotation = req.body.idQuotation
        let quotationData = req.body.quotationData
        quotationData.id_companies = req.body.companyData.id
        let quotationDetails = req.body.quotationDetails.map(({ id, ...rest }) => rest)
        let newQuotation 

        quotationData.id_users_quotation = req.session.userLogged.id 
        
        //save quotation
        if (idQuotation == null) {
          newQuotation = await quotationsQueries.save(quotationData)
        }else{
          await quotationsDetailsQueries.delete(idQuotation)
          await quotationsQueries.update(quotationData,idQuotation)
        }

        //save quotation details
        idQuotation = idQuotation == null ? newQuotation.id : idQuotation
        quotationDetails.forEach(element => {                
          element.enabled = 1,
          element.id_quotations = idQuotation
        })

        await quotationsDetailsQueries.save(quotationDetails)

        //save data in quotations_events_companies
        await qecQueries.updateToNull(idQuotation)
        for (let i = 0; i < quotationDetails.length; i++) {
          await qecQueries.update(quotationDetails[i].id_events,quotationDetails[i].id_companies,quotationData.id_status,idQuotation)          
        }
  
        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    cancelQuotation: async(req,res) =>{
      try{

        let idQuotation = req.body.idQuotation
        let elementsToCancel = req.body.elementsToCancel
        
        //cancel quotation        
        await quotationsQueries.cancel(idQuotation)

        //cancel quotation details
        await quotationsDetailsQueries.cancel(idQuotation)

        //cancel quotations events companies
        await qecQueries.updateToNull(idQuotation)

        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    acceptQuotation: async(req,res) =>{
      try{

        const idQuotation = req.body.idQuotation
        const data = {
          id_status: 1
        }
        
        //accept quotation
        await quotationsQueries.update(data,idQuotation)

        //edit data in quotations events companies
        await qecQueries.updateStatus(idQuotation,data.id_status)

        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    savePurchaseOrder: async(req,res) =>{
      try{
        const data = {
          id_companies: req.body.id_companies,
          id_quotations: req.body.id_quotations,
          //file_name: req.file.filename
        }

        //find data if exists
        const findFile = await qpoQueries.find(data)

        data.file_name = req.file.filename

        if (findFile != null) {
          await qpoQueries.update(data,findFile.id)
        }else{          
          await qpoQueries.create(data)
        }
        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
  }
  module.exports = quotationsApisController