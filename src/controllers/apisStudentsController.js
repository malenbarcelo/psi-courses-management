const eventsStudentsQueries = require('./dbQueries/eventsStudentsQueries')

const apisStudentsController = {
  eventCompanyAssignedStudents: async(req,res) =>{
    try{

      const companyId = req.params.companyId
      const eventId = req.params.eventId      

      const assignedStudents = await eventsStudentsQueries.eventCompanyAssignedStudents(companyId,eventId)

      res.status(200).json(assignedStudents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  companyAssignedStudents: async(req,res) =>{
    try{

      const companyId = req.params.companyId

      const assignedStudents = await eventsStudentsQueries.companyAssignedStudents(companyId)

      res.status(200).json(assignedStudents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  updateAssignedStudents: async(req,res) =>{
    try{

      const companyId = req.body.id_companies
      const eventId = req.body.id_events
      const students = req.body.students

      //delete assigned students
      await eventsStudentsQueries.deleteStudents(companyId,eventId)

      //save new data
      await eventsStudentsQueries.assignStudents(students)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisStudentsController

