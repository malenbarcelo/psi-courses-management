const eventsStudentsQueries = require('./dbQueries/eventsStudentsQueries')

const apisStudentsController = {
  assignedStudents: async(req,res) =>{
    try{

      const companyId = req.params.companyId
      const eventId = req.params.eventId      

      const assignedStudents = await eventsStudentsQueries.assignedStudents(companyId,eventId)

      res.status(200).json(assignedStudents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisStudentsController

