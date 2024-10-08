
const eventsStudentsQueries = require('./dbQueries/eventsStudentsQueries')
const ceicQueries = require('./dbQueries/coursesEventsInvitedCompaniesQueries')
const coursesEventsQueries = require('./dbQueries/coursesEventsQueries')
//const qecQueries = require('./dbQueries/quotationsEventsCompaniesQueries')
const ExcelJS = require('exceljs')

const eventsApisController = {
  downloadStudents: async(req,res) =>{
    try{

      const dataToPrint = req.body.students
      const eventData = req.body.eventData

      let excelData = []

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Alumnos')

      //add headers
      worksheet.columns = [
        { header: 'Empresa', key: 'empresa', width: 18 },        
        { header: 'Curso', key: 'curso', width: 18 },
        { header: 'Evento', key: 'evento', width: 15 },
        { header: 'Inicio', key: 'inicio', width: 12 },
        { header: 'Fin', key: 'fin', width: 12 },
        { header: 'Horario', key: 'horario', width: 18 },
        { header: 'Apellido', key: 'apellido', width: 18 },
        { header: 'Nombre', key: 'nombre', width: 18 },
        { header: 'DNI', key: 'dni', width: 15 },
        { header: 'ART', key: 'art', width: 15 },
        { header: 'Apto médico', key: 'aptoMedico', width: 15 },
      ]

      //add data
      dataToPrint.forEach(element => {
        excelData.push({
          empresa:element.company_data.company_name,
          curso:eventData.events_courses.course_name,
          evento:'#' + String(eventData.id).padStart(8,'0'),
          inicio: eventData.start_date.split('-')[2] + '/' + eventData.start_date.split('-')[1] + '/' + eventData.start_date.split('-')[0],
          fin:eventData.end_date.split('-')[2] + '/' + eventData.end_date.split('-')[1] + '/' + eventData.end_date.split('-')[0],
          horario:eventData.start_time.slice(0,-3) + 'hs. a ' + eventData.end_time.slice(0,-3) + 'hs.',
          apellido:element.last_name,
          nombre:element.first_name,
          dni:element.dni,
          art:element.art,
          aptoMedico:element.medical_certificate == 1 ? 'si' : 'no'

        })
      })

      excelData.forEach((row) => {
        worksheet.addRow(row)
      })

      //create excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=alumnos.xlsx')

      await workbook.xlsx.write(res)
      res.end()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  downloadEvents: async(req,res) =>{
    try{

      const dataToPrint = req.body

      let excelData = []

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Alumnos')

      //add headers
      worksheet.columns = [
        { header: 'Curso', key: 'curso', width: 18 },
        { header: 'Evento', key: 'evento', width: 15 },
        { header: 'Inicio', key: 'inicio', width: 12 },
        { header: 'Fin', key: 'fin', width: 12 },
        { header: 'Horario', key: 'horario', width: 18 },
        { header: 'Estado', key: 'estado', width: 10 },
        { header: 'Cupo', key: 'cupo', width: 10 },
        { header: 'Disponible', key: 'disponible', width: 10 },
        { header: 'Reservado', key: 'reservado', width: 10 },
        { header: 'Asignado', key: 'asignado', width: 10 }
      ]

      //add data
      dataToPrint.forEach(element => {
        excelData.push({
          curso:element.events_courses.course_name,
          evento:'#' + String(element.id).padStart(8,'0'),
          inicio: element.start_date.split('-')[2] + '/' + element.start_date.split('-')[1] + '/' + element.start_date.split('-')[0],
          fin:element.end_date.split('-')[2] + '/' + element.end_date.split('-')[1] + '/' + element.end_date.split('-')[0],
          horario:element.start_time.slice(0,-3) + 'hs. a ' + element.end_time.slice(0,-3) + 'hs.',
          estado: element.status == 'finished' ? 'Finalizado' : (element.status == 'onCourse' ? 'En curso' : 'Por comenzar'),
          cupo:element.event_quota,
          disponible:element.event_quota - element.eventReservations,
          reservado:req.session.userLogged.id_users_categories == 4 ? element.companyReservations : element.eventReservations,
          asignado:req.session.userLogged.id_users_categories == 4 ? element.companyAssignations : element.eventAssignations
        })
      })

      excelData.forEach((row) => {
        worksheet.addRow(row)
      })

      //create excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=alumnos.xlsx')

      await workbook.xlsx.write(res)
      res.end()

    }catch(error){
      console.log(error)
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