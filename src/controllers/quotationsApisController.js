
const qecQueries = require('./dbQueries/quotationsEventsCompaniesQueries')
const quotationsQueries = require('./dbQueries/quotationsQueries')
const quotationsDetailsQueries = require('./dbQueries/quotationsDetailsQueries')
const quotationsStatusQueries = require('./dbQueries/quotationsStatusQueries')

const quotationsApisController = {
    inProgressQuotations: async(req,res) =>{
      try{
  
        const inProgress = await qecQueries.inProgress()
  
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
  
        const allData = await quotationsQueries.allData()
  
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

        let quotationData = req.body.quotationData
        let quotationDetails = req.body.quotationDetails.map(({ id, ...rest }) => rest)

        quotationData.id_users_quotation = req.session.userLogged.id 
        
        //save quotation
        await quotationsQueries.saveQuotation(quotationData)

        //find quotation id
        const quotations = await quotationsQueries.allData()
        const id = Math.max(...quotations.map(obj => obj.id))

        //save quotation details
        quotationDetails.forEach(element => {
          element.enabled = 1,
          element.id_quotations = id
        })

        await quotationsDetailsQueries.saveQuotationDetails(quotationDetails)

        //save data in quotations_events_companies
        for (let i = 0; i < quotationDetails.length; i++) {
          if (quotationDetails[i].data.length != 0) {
            await qecQueries.update(quotationDetails[i].data.id_events,quotationDetails[i].data.id_companies,id)
          }
        }
  
        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
  }
  module.exports = quotationsApisController