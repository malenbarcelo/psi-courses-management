import eg from "./globals.js"

function filterEvents() {
    eg.eventsFiltered = eg.events

    //course
    eg.eventsFiltered = filterCourse.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => e.id_courses == filterCourse.value)

    //startDate
    eg.eventsFiltered = filterStartDate.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => e.start_date == filterStartDate.value)

    //endDate
    eg.eventsFiltered = filterEndDate.value == '' ? eg.eventsFiltered : eg.eventsFiltered.filter(e => e.end_date == filterEndDate.value)

    //reserved events
    if (eg.idUserCategories == 4) {
        if (filterReserved.checked) {
            eg.eventsFiltered = eg.eventsFiltered.filter(e => e.companyReservations != 0)
        }else{
            eg.eventsFiltered = eg.eventsFiltered
        }
    }else{
        const checkedElements = []
        if (filterOnCourse.checked) {
            checkedElements.push('onCourse')
        }
        if (filterPending.checked) {
            checkedElements.push('pending')
        }
        eg.eventsFiltered = (checkedElements.length == 0 || checkedElements.length == 3) ? eg.eventsFiltered : eg.eventsFiltered.filter(e => checkedElements.includes(e.status))

    }
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