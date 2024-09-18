const quotaReservationsQueries = require('./dbQueries/quotaReservationsQueries')
//const qecQueries = require('./dbQueries/quotationsEventsCompaniesQueries')
//const quotationsQueries = require('./dbQueries/quotationsQueries')
const coursesQueries = require('./dbQueries/coursesQueries')
const eventsStudentsQueries = require('./dbQueries/eventsStudentsQueries')

const apisQuotaReservations = {
  companiesPerCourse: async(req,res) =>{
    try{

      const companiesPerCourse = await quotaReservationsQueries.companiesPerCourse()

      res.status(200).json(companiesPerCourse)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  reserveQuota: async(req,res) =>{
    try{
      const data = req.body
      const idUser = req.session.userLogged.id

      //reserve quota
      await quotaReservationsQueries.reserveQuota(data.id_courses,data.id_events,data.id_companies,data.reserved_quota,idUser)

      //create quotations_events_companies
      //await qecQueries.create(data.id_events,data.id_companies)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editReservation: async(req,res) =>{
    try{
      const data = req.body
      const idUser = req.session.userLogged.id

      //get reservations data
      const eventReservedQuota = await quotaReservationsQueries.eventReservedQuota(data.id_companies,data.id_events)
      const quotaDifference = data.reserved_quota - eventReservedQuota

      //edit reservation
      await quotaReservationsQueries.reserveQuota(data.id_courses,data.id_events,data.id_companies,quotaDifference,idUser)

      //reject quotation if applies
      // if (data.idQuoteToReject != 0) {
      //   await quotationsQueries.refuse(data.idQuoteToReject)
      //   await qecQueries.updateToNull(data.idQuoteToReject)
      // }
      
      //cancel quotation if applies
      // if (data.idQuoteToCancel != 0) {
      //   await quotationsQueries.cancel(data.idQuoteToCancel)
      //   await qecQueries.updateToNull(data.idQuoteToCancel)
      // }      

      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  cancelReservation: async(req,res) =>{
    try{
      const data = req.body

      //cancel reservation
      await quotaReservationsQueries.cancelReservation(data)

      //cancel assigned students
      await eventsStudentsQueries.cancel(data)

      //cancel quotations events companies
      //await qecQueries.cancel(data.id_events,data.id_companies)

      //reject quotation if applies
      // if (data.idQuoteToReject != 0) {
      //   await quotationsQueries.refuse(data.idQuoteToReject)
      //   await qecQueries.updateToNull(data.idQuoteToReject)
      // }
      
      //cancel quotation if applies
      // if (data.idQuoteToCancel != 0) {
      //   await quotationsQueries.cancel(data.idQuoteToCancel)
      //   await qecQueries.updateToNull(data.idQuoteToCancel)
      // }

      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  reservationsPerEventCompany: async(req,res) =>{
    try{

      const data = await quotaReservationsQueries.reservationsPerEventCompany()

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisQuotaReservations

