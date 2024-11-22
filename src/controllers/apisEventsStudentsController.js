const eventsStudentsQueries = require('./dbQueries/eventsStudentsQueries')
const readXlsFile = require('read-excel-file/node')

const apisEventsStudentsController = {
  eventCompanyAssignedStudents: async(req,res) =>{
    try{

      const companyId = req.params.idCompany
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
      const students = req.body.students.map(({ id, ...rest }) => rest)
      const studentsFrom = req.session.userLogged == 4 ? 'customer' : 'administrator'

      //delete assigned students
      await eventsStudentsQueries.deleteStudents(companyId,eventId,studentsFrom)
      
      //save new data
      await eventsStudentsQueries.assignStudents(students)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  studentsPerCourse: async(req,res) =>{
    try{

      const studentsPerCourse = await eventsStudentsQueries.studentsPerCourse()

      res.status(200).json(studentsPerCourse)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  readExcelFile: async(req,res) =>{
    try{
        const file = req.file.filename
        const data = await readXlsFile('public/files/studentsAssignation/' + file)
        console.log(file)
        return res.status(200).json(data)
    }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
    }
},
}
module.exports = apisEventsStudentsController

