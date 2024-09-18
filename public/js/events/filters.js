import eg from "./globals.js"
import { dominio } from "../dominio.js"

function filterEvents() {
    eg.eventsFiltered = eg.events

    //course
    eg.eventsFiltered = filterCourse.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => e.id_courses == filterCourse.value)

    //month
    eg.eventsFiltered = filterMonth.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => e.month == filterMonth.value)

    //year
    eg.eventsFiltered = filterYear.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => e.year == filterYear.value)

    //reserved events
    if (eg.idUserCategories != 4) {        
        eg.eventsFiltered = filterReserved.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => filterReserved.value == 1 ? e.eventReservations != 0 : e.eventReservations == 0)        
    }else{
        eg.eventsFiltered = filterReserved.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => filterReserved.value == 1 ? e.companyReservations != 0 : e.companyReservations == 0)
    }

    //event status
    const checkedElements = []
    if (filterOnCourse.checked) {
        checkedElements.push('onCourse')
    }
    if (filterPending.checked) {
        checkedElements.push('pending')
    }
    if (filterFinished.checked) {
        checkedElements.push('finished')
    }
    eg.eventsFiltered = (checkedElements.length == 0 || checkedElements.length == 4) ? eg.eventsFiltered : eg.eventsFiltered.filter(e => checkedElements.includes(e.status))
}

async function filterStudents() {

    if (stppCompany.value == '') {
        eg.eventStudentsFiltered = eg.eventStudents
        stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.eventData.eventReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length        
    }else{
        const companyEvents = await (await fetch(dominio + 'apis/courses-events/company-events/' + stppCompany.value)).json()
        const filterEvent = companyEvents.filter( e => e.id == eg.idEvents)[0]

        eg.eventStudentsFiltered = eg.eventStudents.filter( es => es.id_companies == stppCompany.value)

        stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + filterEvent.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudentsFiltered.length
        
    }
}

export {filterEvents, filterStudents}