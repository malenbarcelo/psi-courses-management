import { dominio } from "../dominio.js"
import neg from "./nextEventsGlobals.js"
import {isInvalid,isValid,dateToString,clearInputs } from "../generalFunctions.js"

async function printEvents(dataToPrint) {
    eventsLoader.style.display = 'block';
    divCourses.innerHTML = '';

    const fragment = document.createDocumentFragment();

    dataToPrint.forEach(element => {

        const today = new Date()
        const startTime = element.events_companies_events.start_time.split(':')[0] + ':' + element.events_companies_events.start_time.split(':')[1]
        const endTime = element.events_companies_events.end_time.split(':')[0] + ':' + element.events_companies_events.end_time.split(':')[1]
        const quota = element.events_companies_events.event_quota
        const eventReservations = element.events_companies_events.events_quota_reservations.filter(r => r.enabled == 1)
        const reservedQuota = eventReservations.reduce((sum, item) => sum + item.reserved_quota, 0)
        const availableQuota = quota - reservedQuota
        let companyReservations = eventReservations.filter( er => er.id_companies == neg.idCompany)
        companyReservations = companyReservations.length == 0 ? 0 : companyReservations.reduce((sum, item) => sum + item.reserved_quota, 0)

        const divCourse = document.createElement('div');
        divCourse.id = 'divCourse';

        const courseTitle = document.createElement('div');
        courseTitle.id = 'courseTitle';
        courseTitle.textContent = element.events_companies_courses.course_name

        const courseNextEvent = document.createElement('div');
        courseNextEvent.id = 'courseNextEvent';
        courseNextEvent.innerHTML = '<div><b>Próximo evento:</b></div><div>' + dateToString(element.events_companies_events.start_date) + ' - ' + dateToString(element.events_companies_events.end_date) + '</div><div>' + startTime + ' a ' + endTime + ' hs.</div>';

        const courseInfo = document.createElement('div');
        courseInfo.id = 'courseInfo';
        courseInfo.innerHTML = '<div><b>Cupos disponibles: </b>' + availableQuota + '</div><div><b>Cupos reservados: </b>' + companyReservations + '</div>';

        const coursesActions = document.createElement('div');
        coursesActions.id = 'courseActions';
        
        const editAction = document.createElement('div');
        editAction.className = companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        editAction.innerHTML = '<i class="fa-regular fa-pen-to-square icon" id="edit_' + element.id + '"></i><div class="courseActionInfo2">Editar reserva</div>';

        const cancelAction = document.createElement('div');
        cancelAction.className = companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        cancelAction.innerHTML = '<i class="fa-regular fa-circle-xmark icon" id="cancel_' + element.id + '"></i><div class="courseActionInfo2">Cancelar reserva</div>';

        const studentsAction = document.createElement('div');
        studentsAction.className = companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        studentsAction.innerHTML = '<i class="fa-solid fa-user icon" id="students_' + element.id + '"></i><div class="courseActionInfo2">Alumnos</div>';

        const reserveAction = document.createElement('div');
        reserveAction.className = companyReservations != 0 ? 'courseAction notVisible' : 'courseAction';
        reserveAction.innerHTML = '<i class="fa-solid fa-user-plus icon" id="reserve_' + element.id + '"></i><div class="courseActionInfo2">Reservar cupo</div>';

        coursesActions.appendChild(editAction);
        coursesActions.appendChild(cancelAction);
        coursesActions.appendChild(studentsAction);
        coursesActions.appendChild(reserveAction);
        
        divCourse.appendChild(courseTitle);
        divCourse.appendChild(courseNextEvent);
        divCourse.appendChild(courseInfo);
        divCourse.appendChild(coursesActions);

        fragment.appendChild(divCourse);
    });

    divCourses.appendChild(fragment);

    addEventsEventListeners(dataToPrint);

    eventsLoader.style.display = 'none';
}

function addEventsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const reserve = document.getElementById('reserve_' + element.id)
        const cancel = document.getElementById('cancel_' + element.id)

        //reserve quota
        reserve.addEventListener('click',async()=>{
            const startTime = element.events_companies_events.start_time.split(':')[0] + ':' + element.events_companies_events.start_time.split(':')[1]
            const endTime = element.events_companies_events.end_time.split(':')[0] + ':' + element.events_companies_events.end_time.split(':')[1]
            const quota = element.events_companies_events.event_quota
            const eventReservations = element.events_companies_events.events_quota_reservations.filter(r => r.enabled == 1)
            const reservedQuota = eventReservations.reduce((sum, item) => sum + item.reserved_quota, 0)            
            const availableQuota = quota - reservedQuota
        
            clearInputs([rqppQuota])
            rqppQuotaError.style.display = 'none'            
            rqppCourse.innerText = element.events_companies_courses.course_name
            rqppDate.innerText = dateToString(element.events_companies_events.start_date) + ' - ' + dateToString(element.events_companies_events.end_date)
            rqppTime.innerText = startTime + ' a ' + endTime + ' hs.'
            rqppAvailableQuota.innerText = 'Cupos disponibles: ' + availableQuota
            neg.eventId = element.id_events
            neg.eventAvailableQuota = availableQuota
            neg.eventCourseName = element.events_companies_courses.course_name
            neg.eventCourseId = element.id_courses
            rqpp.style.display = 'block'
        })

        //cancel reservation
        cancel.addEventListener('click',async()=>{
            neg.eventId = element.id_events           
            neg.eventCourseName = element.events_companies_courses.course_name
            creppQuestion.innerHTML = '¿Confirma que desea cancelar la reserva del curso <b>' + neg.eventCourseName + '</b> que se dictará el <b>' + dateToString(element.events_companies_events.start_date) + '</b>?'
            crepp.style.display = 'block'
        })
        
    })
}

function filterEvents() {

    neg.companyEventsFiltered = neg.companyEvents

    //course
    neg.companyEventsFiltered = filterCourse.value == '' ? neg.companyEventsFiltered : neg.companyEventsFiltered.filter(e => e.id_courses == filterCourse.value)

    //reserved events
    // if (filterReserved.checked) {

    //     console.log(neg.companyEventsFiltered.events_companies_events)

    //     const prueba = neg.companyEventsFiltered.events_companies_events.events_quota_reservations.filter( eqr => eqr.enabled == 1)
    //     console.log(events_company_events.events_quota_reservations)
    //     console.log(prueba)
        

    //     console.log(neg.companyEventsFiltered)
    // }else{
    //     neg.companyEventsFiltered = neg.companyEventsFiltered
    // }

}

function reserveQuotaValidations() {

    let errors = 0

    //quota
    if (rqppQuota.value == '' || rqppQuota.value <= 0) {
        rqppQuotaError.innerText = 'El cupo debe ser un número mayor a 0'
        isInvalid([rqppQuota])
        rqppQuotaError.style.display = 'block'
        errors +=1
    }else{
        if (rqppQuota.value > neg.eventAvailableQuota) {
            rqppQuotaError.innerText = 'Se puede reservar una cantidad máxima de ' + neg.eventAvailableQuota + ' cupos'
            isInvalid([rqppQuota])
            rqppQuotaError.style.display = 'block'
            errors +=1
        }else{
            isValid([rqppQuota])
            rqppQuotaError.style.display = 'none'
        }
    }
    return errors
}

export {printEvents,filterEvents,reserveQuotaValidations}