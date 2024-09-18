const coursesEventsQueries = require('./dbQueries/coursesEventsQueries')
const coursesEventsInvitedCompaniesQueries = require('./dbQueries/coursesEventsInvitedCompaniesQueries')

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
  nextEvents: async(req,res) =>{
    try{

      const idCompany = 1 //PSI SMART SERVICES

      let events = await coursesEventsQueries.events()
      events = events.map(event => event.get({ plain: true })) //get plain data to edit json

      addEventInformation(events, idCompany)

      const nextEvents = events.filter( e => e.status != 'finished')

      res.status(200).json(nextEvents)

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
  companyNextEvents: async(req,res) =>{
    try{

      const idCompany = req.params.idCompany

      let events = await coursesEventsQueries.companyEvents(idCompany)
      
      events = events.map(event => event.get({ plain: true })) //get plain data to edit json

      addEventInformation(events,idCompany)

      const nextEvents = events.filter( e => e.status != 'finished')

      res.status(200).json(nextEvents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createEvent: async(req,res) =>{
    try{

      const data = req.body

      //create event
      const newEvent = await coursesEventsQueries.createEvent(data)

      //create data courses_events_invited_companies
      await coursesEventsInvitedCompaniesQueries.create(data.invited_companies,data.id_courses, newEvent.id)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editEvent: async(req,res) =>{
    try{

      const data = req.body

      await coursesEventsQueries.editEvent(data)

      //delete courses_events_invited_companies
      await coursesEventsInvitedCompaniesQueries.delete(data.id_events)

      //create new courses_events_invited_companies
      await coursesEventsInvitedCompaniesQueries.create(data.invited_companies,data.id_courses,data.id_events)

      res.status(200).json()

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

    //year and month
    element.year = parseInt(element.start_date.split('-')[0])
    element.month = parseInt(element.start_date.split('-')[1])
    

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

    //hoursToStart
    element.hoursToStart = (startDateTime - dateTime)  / (1000 * 60 * 60)

    //event reservations
    const eventReservations = element.events_quota_reservations.filter(e => e.enabled == 1)
    element.eventReservations = eventReservations.reduce((accum, e) => accum + e.reserved_quota, 0);

    //company reservations
    const companyReservations = element.events_quota_reservations.filter(e => e.enabled == 1 && e.id_companies == idCompany)
    element.companyReservations = companyReservations.reduce((accum, e) => accum + e.reserved_quota, 0);

    //event assignations
    const eventAssignations = element.events_students.filter(e => e.enabled == 1)
    element.eventAssignations = eventAssignations.length

    //company assignations
    const companyAssignations = element.events_students.filter(e => e.enabled == 1 && e.id_companies == idCompany)
    element.companyAssignations = companyAssignations.length

  })

}
module.exports = apisCoursesEventsController

