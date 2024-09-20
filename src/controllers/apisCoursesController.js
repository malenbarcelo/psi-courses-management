const coursesQueries = require('./dbQueries/coursesQueries')
const coursesEventsQueries = require('./dbQueries/coursesEventsQueries')
const coursesEventsInvitedCompaniesQueries = require('./dbQueries/coursesEventsInvitedCompaniesQueries')
const quotaReservationsQueries = require('./dbQueries/quotaReservationsQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const {sendEmail,getDateArg,eventDateToArg} = require('./functions/generalFunctions')

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
  editCourse: async(req,res) =>{
    try{

      const data = req.body
      await coursesQueries.editCourse(data)

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

      const companyNextEvents = await coursesEventsInvitedCompaniesQueries.getCompanyNextEvents(idCompany,dateArg)

      res.status(200).json(companyNextEvents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  companyReservations: async(req,res) =>{
    try{

      const idCompany = req.params.idCompany

      const companyReservations = await quotaReservationsQueries.companyReservations(idCompany)

      res.status(200).json(companyReservations)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = coursesApisController

