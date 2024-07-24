const coursesEventsQueries = require('./dbQueries/coursesEventsQueries')

const apisCoursesEventsController = {
  events: async(req,res) =>{
    try{

      const idCompany = 1 //PSI SMART SERVICES

      let events = await coursesEventsQueries.events()
      events = events.map(event => event.get({ plain: true })) //get plain data to edit json

      addEventInformation(events, idCompany)

      res.status(200).json(events)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  companyEvents: async(req,res) =>{
    try{

      const idCompany = req.params.idCompany

      let events = await coursesEventsQueries.companyEvents(idCompany)
      events = events.map(event => event.get({ plain: true })) //get plain data to edit json

      addEventInformation(events,idCompany)

      res.status(200).json(events)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}

function addEventInformation(events,idCompany) {
  
  //datetime today
  const dateTime = new Date()
  dateTime.setHours(dateTime.getHours() - 3);

  events.forEach(element => {

    //start date time
    let startDateTime = new Date(element.start_date)
    startDateTime.setUTCHours(parseInt(element.start_time.split(':')[0]))
    startDateTime.setUTCMinutes(parseInt(element.start_time.split(':')[1]))
    startDateTime.setUTCSeconds(0)

    //end date time
    let endDateTime = new Date(element.end_date)
    endDateTime.setUTCHours(parseInt(element.end_time.split(':')[0]))
    endDateTime.setUTCMinutes(parseInt(element.end_time.split(':')[1]))
    endDateTime.setUTCSeconds(0)

    element.startDateTime = startDateTime
    element.endDateTime = endDateTime
    element.dateTime = dateTime

    if (endDateTime < dateTime) {
      element.status = 'finished'
    }else{
      if (startDateTime > dateTime) {
        element.status = 'pending'          
      }else{
        element.status = 'onCourse'
      }
    }

    //event reservations
    const eventReservations = element.events_quota_reservations.filter(e => e.enabled == 1)
    element.eventReservations = eventReservations.length

    //company reservations
    const companyReservations = element.events_quota_reservations.filter(e => e.enabled == 1 && e.id_companies == idCompany)
    element.companyReservations = companyReservations.length

    //event assignations
    const eventAssignations = element.events_students.filter(e => e.enabled == 1)
    element.eventAssignations = eventAssignations.length

    //company assignations
    const companyAssignations = element.events_students.filter(e => e.enabled == 1 && e.id_companies == idCompany)
    element.companyAssignations = companyAssignations.length

  })
}
module.exports = apisCoursesEventsController

