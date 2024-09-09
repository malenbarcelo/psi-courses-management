
const eventsStudentsQueries = require('./dbQueries/eventsStudentsQueries')
const ceicQueries = require('./dbQueries/coursesEventsInvitedCompaniesQueries')
const coursesEventsQueries = require('./dbQueries/coursesEventsQueries')
const qecQueries = require('./dbQueries/quotationsEventsCompaniesQueries')
const ExcelJS = require('exceljs')

const eventsApisController = {
  getEventsHistory: async(req,res) =>{
    try{

      const data = req.body
      let students

      console.log(data)

      if (data.idUserCategories != 4) {
        console.log('hola')
        students = await eventsStudentsQueries.allData()
      }else{
        console.log('chau')
        students = await eventsStudentsQueries.filterStudents(data.id_companies)
      }
      
      const quotations = await qecQueries.allData()

      students.forEach(student => {
        const quotationData = quotations.filter(q => q.id_events == student.id_events &&  q.id_companies == student.id_companies)
        student.quotation_data = quotationData[0]
        
      })

      res.status(200).json(students)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  predictStudents: async(req,res) =>{
    try{
      const string = req.params.string.toLowerCase()

      const students = await eventsStudentsQueries.distinctStudents()

      console.log(students)

      const predictedStudents = students.filter(s => s.student.toLowerCase().includes(string))

      res.status(200).json(predictedStudents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  downloadData: async(req,res) =>{
    try{

      const dataToPrint = req.body
      let excelData = []

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Historial de Eventos')

      //add headers
      worksheet.columns = [
        { header: 'Empresa', key: 'empresa', width: 30 },
        { header: 'Curso', key: 'curso', width: 30 },
        { header: 'Evento', key: 'evento', width: 15 },
        { header: 'Inicio', key: 'inicio', width: 15 },
        { header: 'Fin', key: 'fin', width: 15 },
        { header: 'Apellido', key: 'apellido', width: 30 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'DNI', key: 'dni', width: 15 }
      ]

      //add data
      dataToPrint.forEach(element => {
        excelData.push({
          empresa:element.company_data.company_name,
          curso:element.course_data.course_name,
          evento: '#' + String(element.event_data.id).padStart(8,'0'),
          inicio: element.event_data.start_date.split('-')[2] + '/' + element.event_data.start_date.split('-')[1] + '/' + element.event_data.start_date.split('-')[0],
          fin:element.event_data.end_date.split('-')[2] + '/' + element.event_data.end_date.split('-')[1] + '/' + element.event_data.end_date.split('-')[0],
          apellido:element.last_name,
          nombre:element.first_name,
          email:element.email,
          dni:element.dni
        })
      })

      excelData.forEach((row) => {
        worksheet.addRow(row)
      })

      //create excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=historial_de_eventos.xlsx')

      await workbook.xlsx.write(res)
      res.end()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  deleteEvent: async(req,res) =>{
    try{

      const data = req.body
      
      console.log(data)

      //unable event
      await ceicQueries.delete(data.id_events)

      //delete courses_events_invited_companies
      await coursesEventsQueries.deleteEvent(data.id_events)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}

module.exports = eventsApisController