import eg from "./globals.js"
import {dateToString, showOkPopup } from "../generalFunctions.js"

function completeNextEventsGlobals(element) {
    eg.studentsFrom = eg.idUserCategories == 4 ? 'customer' : 'administrator'
    eg.companyEventData = element
    eg.idEvents = element.id
    eg.eventCourseName = element.events_courses.course_name
    eg.idCourses = element.id_courses
    eg.companyReservations = element.companyReservations
    eg.eventStudents = eg.studentsFrom == 'customer' ? element.events_students.filter(es => es.id_companies == eg.idCompanies && es.enabled == 1) : element.events_students.filter(es => es.enabled == 1)
    eg.eventStudentsFiltered = eg.eventStudents
    eg.eventInvitedCompanies = []
    element.events_invited_companies.forEach(company => {
        eg.eventInvitedCompanies.push(company.id_companies)
    })

    eg.eventCompanies = [...new Set(element.events_quota_reservations.map(er => er.id_companies))]
}

function clickCompanies() {
    eg.companies.forEach(company => {
        const check = document.getElementById('ceppCompany_' + company.id)
        if (eg.eventInvitedCompanies.includes(company.id)) {
            check.checked = true
        }else{
            check.checked = false
        }                  
    })
}

function clickAllCompanies() {
    if (ceppAllCompanies.checked) {
        eg.companies.forEach(company => {
            const check = document.getElementById('ceppCompany_' + company.id)
            check.checked = true
            eg.eventInvitedCompanies.push(company.id)                       
        })

    }else{
        eg.companies.forEach(company => {
            const check = document.getElementById('ceppCompany_' + company.id)
            check.checked = false
        })
        eg.eventInvitedCompanies = []         
    }
}

function clickCancel(element){

    const action = eg.editReservationFrom == 'administrator' ? 'cancelada' : 'rechazada'

    if (eg.companyEventData.quotations_events_companies[0].id_quotations_status == 1) {
        rqppErrorText.innerText = 'No es posible cancelar reservas con cotizaciones aprobadas.'
        showOkPopup(rqppError)
    }else{
        creppQuestion.innerHTML = '¿Confirma que desea cancelar la reserva del curso <b>' + element.events_courses.course_name + '</b> que se dictará el <b>' + dateToString(element.start_date) + '</b>?'

        if (eg.companyEventData.quotations_events_companies[0].id_quotations_status == 2 || eg.companyEventData.quotations_events_companies[0].id_quotations_status == 3) {
            creppAlertText.innerHTML = 'El evento posee una cotización en estado: <b>' + eg.companyEventData.quotations_events_companies[0].quotation_status.status + '</b>. Si cencela la reserva, la cotización será ' + action + ' en su totalidad.'
            eg.idQuoteToReject = eg.editReservationFrom == 'customer' ? eg.companyEventData.quotations_events_companies[0].id_quotations : 0
            eg.idQuoteToCancel = eg.editReservationFrom == 'administrator' ? eg.companyEventData.quotations_events_companies[0].id_quotations : 0
            creppAlert.style.display = 'flex'
        }else{
            eg.idQuoteToReject = 0
            eg.idQuoteToCancel = 0
            creppAlert.style.display = 'none'
        }

        crepp.style.display = 'block'

        
    }
}

export {clickAllCompanies, clickCompanies, completeNextEventsGlobals,clickCancel}