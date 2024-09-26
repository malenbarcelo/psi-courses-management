const coursesQueries = require('./dbQueries/coursesQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const eventsStudentsQueries = require('./dbQueries/eventsStudentsQueries')
const bottomHeaderMenu = require('../data/bottomHeaderMenu')
const months = require('../data/months')
const ExcelJS = require('exceljs')

const studentsController = {
    students: async(req,res) => {
        try{

            const idSelectedItem = 3

            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()

            return res.render('students/students',{title:'Students',bottomHeaderMenu,idSelectedItem,courses,companies, months})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    ////APIS
    getData: async(req,res) =>{
        try{
            let data = []

            if (req.session.userLogged.id_users_categories != 4) {
                data = await eventsStudentsQueries.allData()
            }else{
                data = await eventsStudentsQueries.companyData(req.session.userLogged.id_companies)
            }

            data = data.map(d => ({
                ...d, 
                year: d.event_data.start_date.split('-')[0],
                month:d.event_data.start_date.split('-')[1]
            }))

            res.status(200).json(data)
    
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
    predictStudents: async(req,res) =>{
        try{
            const string = req.params.string.toLowerCase()

            const students = await eventsStudentsQueries.distinctStudents()

            const predictedStudents = students.filter(s => s.student.toLowerCase().includes(string))

            res.status(200).json(predictedStudents)
        }catch(error){
            console.group(error)
            return res.send('Ha ocurrido un error')
        }
    },
    downloadStudents: async(req,res) =>{
        try{
    
          const dataToPrint = req.body
    
          let excelData = []
    
          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('Alumnos')
    
          //add headers
          worksheet.columns = [
            { header: 'Empresa', key: 'empresa', width: 20 },
            { header: 'Apellido y nombre', key: 'alumno', width: 30 },
            { header: 'DNI', key: 'dni', width: 15 },
            { header: 'Curso', key: 'curso', width: 30 },
            { header: 'Evento', key: 'evento', width: 15 },
            { header: 'Inicio', key: 'inicio', width: 12 },
            { header: 'Fin', key: 'fin', width: 12 }
          ]
    
          //add data
          dataToPrint.forEach(element => {
            excelData.push({
              empresa:element.company_data.company_name,
              alumno:element.last_name + ', ' + element.first_name,
              dni:element.dni,
              curso:element.course_data.course_name,
              evento:'#' + String(element.id_events).padStart(8,'0'),
              inicio: element.event_data.start_date.split('-')[2] + '/' + element.event_data.start_date.split('-')[1] + '/' + element.event_data.start_date.split('-')[0],
              fin:element.event_data.end_date.split('-')[2] + '/' + element.event_data.end_date.split('-')[1] + '/' + element.event_data.end_date.split('-')[0],
              
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
}

module.exports = studentsController