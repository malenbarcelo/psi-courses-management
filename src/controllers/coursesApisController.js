const coursesQueries = require('./dbQueries/coursesQueries')
const coursesEventsQueries = require('./dbQueries/coursesEventsQueries')
const coursesEventsInvitedCompaniesQueries = require('./dbQueries/coursesEventsInvitedCompaniesQueries')
const coursesQuotaReservationsQueries = require('./dbQueries/coursesQuotaReservationsQueries')
const {getDateArg} = require('./functions/generalFunctions')

const coursesApisController = {
  courses: async(req,res) =>{
    try{

      const courses = await coursesQueries.courses()

      res.status(200).json(courses)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createCourse: async(req,res) =>{
    try{

      const data = req.body
      await coursesQueries.createCourse(data)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createEvent: async(req,res) =>{
    try{

      const data = req.body

      await coursesEventsQueries.createEvent(data)

      //get created event id
      const eventData = await coursesEventsQueries.lastEvent()
      const eventId = eventData.id

      //create data courses_events_invited_companies
      await coursesEventsInvitedCompaniesQueries.create(data.invited_companies,data.id_courses, eventId)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  coursesEvents: async(req,res) =>{
    try{
      const courseId = req.params.courseId

      const courseEvents = await coursesEventsQueries.courseEvents(courseId)

      res.status(200).json(courseEvents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  companyNextEvents: async(req,res) =>{
    try{
      const idCompany = req.params.idCompany

      const date = new Date()

      const {dateArg,timeArg} = getDateArg(date)

      console.log(dateArg)
      console.log(timeArg)

      const companyNextEvents = await coursesEventsInvitedCompaniesQueries.getCompanyNextEvents(idCompany,dateArg)

      res.status(200).json( companyNextEvents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  reserveQuota: async(req,res) =>{
    try{
      const data = req.body

      await coursesQuotaReservationsQueries.reserveQuota(data)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  cancelReservation: async(req,res) =>{
    try{
      const data = req.body

      await coursesQuotaReservationsQueries.cancelReservation(data)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = coursesApisController

