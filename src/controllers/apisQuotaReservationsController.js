const quotaReservationsQueries = require('./dbQueries/quotaReservationsQueries')

const apisQuotaReservations = {
  companiesPerCourse: async(req,res) =>{
    try{

      const companiesPerCourse = await quotaReservationsQueries.companiesPerCourse()

      res.status(200).json(companiesPerCourse)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  }
}
module.exports = apisQuotaReservations

