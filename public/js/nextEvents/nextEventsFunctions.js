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

    await addEventsEventListeners(dataToPrint);

    eventsLoader.style.display = 'none';
}

async function addEventsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const reserve = document.getElementById('reserve_' + element.id)
        const cancel = document.getElementById('cancel_' + element.id)
        const edit = document.getElementById('edit_' + element.id)
        const students = document.getElementById('students_' + element.id)

        //reserve quota
        const inputs = [reserve,edit]
        inputs.forEach(input => {
            input.addEventListener('click',async()=>{
            
                //get element data
                const eventData = await getEventData(element)
                
                if (input.id.split('_')[0] == 'reserve') {
                    rqppMainTitle.innerText = 'RESERVAR CUPO'
                    clearInputs([rqppQuota])
                    rqppQuota.classList.remove('invalidInput')
                    rqppQuotaLabel.classList.remove('invalidLabel')
                    rqppAccept.innerText = 'Reservar'
                    neg.editReservationType = 'reserve'                    
                }else{
                    rqppMainTitle.innerText = 'EDITAR RESERVA'
                    rqppQuota.value = eventData.companyReservationsQty
                    rqppAccept.innerText = 'Editar'
                    neg.editReservationType = 'edit'  
                }

                rqpp.style.display = 'block'
            })
            
        })
        
        //cancel reservation
        cancel.addEventListener('click',async()=>{
            neg.eventId = element.id_events           
            neg.eventCourseName = element.events_companies_courses.course_name
            creppQuestion.innerHTML = '¿Confirma que desea cancelar la reserva del curso <b>' + neg.eventCourseName + '</b> que se dictará el <b>' + dateToString(element.events_companies_events.start_date) + '</b>?'
            crepp.style.display = 'block'
        })

        //students
        students.addEventListener('click',async()=>{
            const eventData = await getEventData(element)
            stppMainTitle.innerText = element.events_companies_courses.course_name
            stppSubtitle.innerHTML = '<b>Fecha:</b> ' + eventData.startDate + ' - ' + eventData.endDate + ' || ' + eventData.startTime + 'hs. a ' +eventData.endTime + 'hs.'
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eventData.companyReservationsQty + ' || <b>Cupos asignados: </b>' + eventData.assignedStudents.length
            printStudents(neg.assignedStudents)
            stpp.style.display = 'block'
        })
        
    })
}

async function getEventData(element) {

    const assignedStudents = await (await fetch(dominio + 'apis/assigned-students/' + neg.idCompany + '/' + element.id_events)).json()

    const startDate = dateToString(element.events_companies_events.start_date)
    const endDate = dateToString(element.events_companies_events.end_date)
    const startTime = element.events_companies_events.start_time.split(':')[0] + ':' + element.events_companies_events.start_time.split(':')[1]
    const endTime = element.events_companies_events.end_time.split(':')[0] + ':' + element.events_companies_events.end_time.split(':')[1]
    const quota = element.events_companies_events.event_quota
    const eventReservations = element.events_companies_events.events_quota_reservations.filter(r => r.enabled == 1)
    const reservedQuota = eventReservations.reduce((sum, item) => sum + item.reserved_quota, 0)            
    const availableQuota = quota - reservedQuota
    dateToString(element.events_companies_events.start_date)
    const companyReservations = eventReservations.filter(e => e.id_companies == neg.idCompany)
    const companyReservationsQty = companyReservations.reduce((sum, item) => sum + item.reserved_quota, 0)

    //complete info
    neg.eventId = element.id_events
    neg.eventAvailableQuota = availableQuota
    neg.eventCourseName = element.events_companies_courses.course_name
    neg.eventCourseId = element.id_courses
    neg.companyReservationsQty = companyReservationsQty
    neg.assignedStudents = assignedStudents
    rqppQuotaError.style.display = 'none'
    rqppCourse.innerText = element.events_companies_courses.course_name
    rqppDate.innerText = dateToString(element.events_companies_events.start_date) + ' - ' + dateToString(element.events_companies_events.end_date)
    rqppTime.innerText = startTime + ' a ' + endTime + ' hs.'
    rqppAvailableQuota.innerText = 'Cupos disponibles: ' + availableQuota
    rqppQuotaError.style.display = 'none'
    rqppQuotaError.style.display = 'none'            
    rqppCourse.innerText = element.events_companies_courses.course_name
    rqppDate.innerText = dateToString(element.events_companies_events.start_date) + ' - ' + dateToString(element.events_companies_events.end_date)
    rqppTime.innerText = startTime + ' a ' + endTime + ' hs.'
    rqppAvailableQuota.innerText = 'Cupos disponibles: ' + availableQuota

    const eventData = {startDate,endDate,startTime,endTime,companyReservationsQty,availableQuota,assignedStudents}

    return eventData
}

function filterEvents() {

    neg.companyEventsFiltered = neg.companyEvents

    //course
    neg.companyEventsFiltered = filterCourse.value == '' ? neg.companyEventsFiltered : neg.companyEventsFiltered.filter(e => e.id_courses == filterCourse.value)

    //reserved events
    if (filterReserved.checked) {

        const reservationsIds = neg.companyReservations.map(r => r.id_events)
        neg.companyEventsFiltered = neg.companyEventsFiltered.filter(e => reservationsIds.includes(e.id_events))

        // const prueba = neg.companyEventsFiltered.events_companies_events.events_quota_reservations.filter( eqr => eqr.enabled == 1)
        // console.log(events_company_events.events_quota_reservations)
        // console.log(prueba)
        

        // console.log(neg.companyEventsFiltered)
    }else{
        neg.companyEventsFiltered = neg.companyEventsFiltered
    }

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

function editQuotaValidations() {

    let errors = 0

    //quota
    if (rqppQuota.value == '' || rqppQuota.value <= 0) {
        rqppQuotaError.innerText = 'El cupo debe ser un número mayor a 0'
        isInvalid([rqppQuota])
        rqppQuotaError.style.display = 'block'
        errors +=1
    }else{
        if (rqppQuota.value > (neg.eventAvailableQuota + neg.companyReservationsQty)) {
            rqppQuotaError.innerText = 'Se puede reservar una cantidad máxima de ' + (neg.eventAvailableQuota + neg.companyReservationsQty) + ' cupos'
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

async function printStudents(dataToPrint) {

    studentsLoader.style.display = 'block'
    
    bodyStudents.innerHTML = ''
    let counter = 0

    let html = '';
    dataToPrint.forEach(element => {
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
        
        // Construir las filas de la tabla
        html += `
            <tr>
                <th class="${rowClass}">${element.last_name}</th>
                <th class="${rowClass}">${element.first_name}</th>
                <th class="${rowClass}">${element.email}</th>
                <th class="${rowClass}">${element.dni}</th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
            </tr>
        `;
        
        counter += 1;
    });

// Insertar todo el HTML en el DOM de una sola vez
bodyStudents.innerHTML += html;

    //addStudentsEventListeners(dataToPrint)

    studentsLoader.style.display = 'none'
}



export {printEvents,filterEvents,reserveQuotaValidations,editQuotaValidations}