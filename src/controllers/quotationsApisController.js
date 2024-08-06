
const qecQueries = require('./dbQueries/quotationsEventsCompaniesQueries')
const quotationsQueries = require('./dbQueries/quotationsQueries')

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
  }
  module.exports = quotationsApisController