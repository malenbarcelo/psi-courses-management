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
  },
  reserveQuota: async(req,res) =>{
    try{

      console.log('hola')
      const data = req.body
      const idUser = req.session.userLogged.id

      //reserve quota
      await quotaReservationsQueries.reserveQuota(data.id_courses,data.id_events,data.id_companies,data.reserved_quota,idUser  )

      //send email
      const courseData = await coursesQueries.findCourse(data.id_courses)
      const eventData = await coursesEventsQueries.findEvent(data.id_events)
      const companyData = await companiesQueries.findCompany(data.id_companies)
      const startDate = eventDateToArg(eventData.start_date)
      const startTime = eventData.start_time.substring(0, 5)
      const endTime = eventData.end_time.substring(0, 5)
      const subject = 'Curso ' + courseData.course_name + ' - reserva de cupos'
      const line1 = '<h3 style="color: black;">Curso ' + courseData.course_name + ' - reserva de cupos</h3>'
      const line2 = '<div>La empresa <b>' + companyData.company_name +'</b> ha reservado <b>' + req.body.reserved_quota +'</b> cupos para el curso <b>' + courseData.course_name + '</b> que se dictará a partir del <b>' + startDate + '</b> de ' + startTime + 'hs. a ' + endTime + 'hs.</div>'
      const body = line1 + line2      

      sendEmail(subject,body)

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

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  cancelReservation: async(req,res) =>{
    try{
      const data = req.body

      await quotaReservationsQueries.cancelReservation(data)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisQuotaReservations

