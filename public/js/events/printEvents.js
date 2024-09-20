import { dominio } from "../dominio.js"
import eg from "./globals.js"
import {isValid,dateToString,clearInputs, showOkPopup, uncheckInputs } from "../generalFunctions.js"
import { printCompanies } from "./printEventCompanies.js"
import { printStudents } from "./printEventStudents.js"
import { completeNextEventsGlobals, clickCompanies, clickCancel } from "./functions.js"

// async function printEvents(dataToPrint) {

//     eventsLoader.style.display = 'block'
//     divEvents.innerHTML = ''

//     if (dataToPrint.length == 0) {
//         noQuotationsToShow.style.display = 'flex'
//         divEvents.style.display = 'none'
//     }else{
//         noQuotationsToShow.style.display = 'none'
//         divEvents.style.display = 'flex'
//         const fragment = document.createDocumentFragment()

//     dataToPrint.forEach(element => {

//         //get data
//         const startTime = element.start_time.substring(0, 5)
//         const endTime = element.end_time.substring(0, 5)
//         const availableQuota = element.event_quota - element.eventReservations
//         const reservations = eg.idUserCategories == 4 ? element.companyReservations : element.eventReservations
//         const assignations = eg.idUserCategories == 4 ? element.companyAssignations : element.eventAssignations
//         const missingAssignations = reservations - assignations
        
//         const divEvent = document.createElement('div');
//         divEvent.id = 'divEvent';

//         const eventCourseTitle = document.createElement('div');
//         eventCourseTitle.id = 'eventCourseTitle';
//         eventCourseTitle.textContent = element.events_courses.course_name

//         const eventId = document.createElement('div');
//         eventId.id = 'eventId';
//         eventId.textContent = '#' + String(element.id).padStart(8, '0')

//         const eventData = document.createElement('div');
//         eventData.id = 'eventData';
//         eventData.innerHTML = '<div>' + dateToString(element.start_date) + ' - ' + dateToString(element.end_date) + '</div><div>' + startTime + ' a ' + endTime + ' hs.</div>';

//         const eventInfo = document.createElement('div');
//         eventInfo.id = 'eventInfo';
//         eventInfo.innerHTML = '<div>Disponible: ' + availableQuota + '</div><div>Reservado: ' + reservations + '</div><div>Asignado: ' + assignations + '</div>';

//         const eventActions = document.createElement('div');
//         eventActions.id = 'eventActions';

//         const onCourse = document.createElement('div');
//         onCourse.id = 'onCourse';
//         onCourse.innerHTML = element.status == 'onCourse' ? 'En curso' : element.status == 'finished' ? 'Finalizado' : 'Por iniciar';

//         const editEventAction = document.createElement('div');
//         editEventAction.className = element.status == 'finished' ? 'courseAction notVisible' : 'courseAction';
//         editEventAction.innerHTML = '<i class="fa-regular fa-pen-to-square icon" id="editE_' + element.id + '"></i><div class="courseActionInfo2">Editar evento</div>';

//         const deleteEventAction = document.createElement('div');
//         deleteEventAction.className = element.status == 'finished' ? 'courseAction notVisible' : 'courseAction';
//         deleteEventAction.innerHTML = '<i class="fa-regular fa-trash-can icon" id="deleteE_' + element.id + '"></i><div class="courseActionInfo2">Eliminar evento</div>';
        
//         const editReservationAction = document.createElement('div');
//         editReservationAction.className = element.companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
//         editReservationAction.innerHTML = '<i class="fa-regular fa-pen-to-square icon" id="editR_' + element.id + '"></i><div class="courseActionInfo2">Editar reserva</div>';

//         const cancelAction = document.createElement('div');
//         cancelAction.className = element.companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
//         cancelAction.innerHTML = '<i class="fa-regular fa-circle-xmark icon" id="cancel_' + element.id + '"></i><div class="courseActionInfo2">Cancelar reserva</div>';

//         const studentsAction = document.createElement('div');
//         studentsAction.className = ((eg.idUserCategories == 4 && element.companyReservations == 0) || (eg.idUserCategories != 4 && element.eventReservations == 0)) ? 'courseAction notVisible' : 'courseAction';
//         studentsAction.innerHTML = '<i class="fa-solid fa-user icon" id="students_' + element.id + '"></i><div class="courseActionInfo2">Alumnos</div>';

//         const companiesAction = document.createElement('div');
//         companiesAction.className = 'courseAction';
//         companiesAction.innerHTML = '<i class="fa-solid fa-industry icon" id="companies_' + element.id + '"></i><div class="courseActionInfo2">Empresas</div>';

//         const reserveAction = document.createElement('div');
//         reserveAction.className = element.companyReservations != 0 ? 'courseAction notVisible' : 'courseAction';
//         reserveAction.innerHTML = '<i class="fa-solid fa-user-plus icon" id="reserve_' + element.id + '"></i><div class="courseActionInfo2">Reservar cupo</div>';

//         const alert = document.createElement('div');
//         alert.className = missingAssignations ? 'eventAlert' : 'notVisible';
//         alert.innerHTML = '<i class="fa-solid fa-triangle-exclamation icon" id="alert_' + element.id + '"></i><div class="courseActionInfo3">Cupos reservados pendientes de asignación</div>';

//         if (eg.idUserCategories == 4) {
//             eventActions.appendChild(editReservationAction);
//             eventActions.appendChild(cancelAction);
//             eventActions.appendChild(studentsAction);
//             eventActions.appendChild(reserveAction);
//             eventActions.appendChild(alert);
//         }else{
//             eventActions.appendChild(editEventAction);
//             eventActions.appendChild(deleteEventAction);
//             eventActions.appendChild(studentsAction);
//             eventActions.appendChild(companiesAction);
//             eventActions.appendChild(alert);
//         }        
        
//         divEvent.appendChild(eventCourseTitle);
//         divEvent.appendChild(eventId);
//         divEvent.appendChild(eventData);
//         divEvent.appendChild(eventInfo);
//         divEvent.appendChild(eventActions);
//         divEvent.appendChild(onCourse);
//         fragment.appendChild(divEvent);
            
        
//     });

//     divEvents.appendChild(fragment);

//     await addEventsEventListeners(dataToPrint);

//     }

//     eventsLoader.style.display = 'none';
// }

async function printEvents(dataToPrint) {

    eventsLoader.style.display = 'block'
    bodyEvents.innerHTML = ''
    let html = ''

    dataToPrint.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        //get data
        const startTime = element.start_time.substring(0, 5)
        const endTime = element.end_time.substring(0, 5)
        const status = element.status == 'finished' ? 'Finalizado' : (element.status == 'onCourse' ? 'En curso' : 'Por comenzar')        
        const availableQuota = element.event_quota - element.eventReservations
        const reservations = eg.idUserCategories == 4 ? element.companyReservations : element.eventReservations
        const assignations = eg.idUserCategories == 4 ? element.companyAssignations : element.eventAssignations
        const missingAssignations = reservations - assignations
        const assignationsColor = missingAssignations > 0 ? 'redColor' : ''

        html += `
            <tr>
                <th class="${rowClass}">${element.events_courses.course_name}</th>
                <th class="${rowClass}">${'#' + String(element.id).padStart(8,'0')}</th>
                <th class="${rowClass}">${dateToString(element.start_date)}</th>
                <th class="${rowClass}">${dateToString(element.end_date)}</th>
                <th class="${rowClass}">${ startTime + ' hs. a ' + endTime + ' hs.'}</th>
                <th class="${rowClass}">${status}</th>
                <th class="${rowClass}">${element.event_quota}</th>
                <th class="${rowClass}">${availableQuota}</th>
                <th class="${rowClass}">${reservations}</th>
                <th class="${rowClass + ' ' + assignationsColor}">${assignations}</th>
            `
        if (eg.idUserCategories != 4) {
            
            html += `
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="editE_${element.id}"></i></th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="deleteE_${element.id}"></i></th>
                <th class="${rowClass}"><i class="fa-solid fa-industry allowedIcon" id="companies_${element.id}"></i></th>
                <th class="${rowClass}"><i class="fa-solid fa-user allowedIcon" id="admStudents_${element.id}"></i></th>
            `
        }else{
            const reserveIcon = (element.companyReservations == 0 && element.hoursToStart >= 24) ? '<i class="fa-regular fa-calendar-plus allowedIcon" id="reserve_' + element.id + '"></i>' : '<i class="fa-regular fa-calendar-plus notAllowedIcon"></i>'
            const editIcon = (element.companyReservations != 0 && element.hoursToStart >= 24) ? '<i class="fa-regular fa-pen-to-square allowedIcon" id="editR_' + element.id + '"></i>': '<i class="fa-regular fa-pen-to-square notAllowedIcon"></i>'
            const cancelIcon = (element.companyReservations != 0 && element.hoursToStart >= 24) ? '<i class="fa-regular fa-circle-xmark allowedIcon" id="cancel_' + element.id + '"></i>': '<i class="fa-regular fa-circle-xmark notAllowedIcon"></i>'
            const studentsIcon = (element.companyReservations != 0 && element.hoursToStart >= 24) ? '<i class="fa-solid fa-user allowedIcon" id="custStudents_' + element.id + '"></i>': '<i class="fa-solid fa-user notAllowedIcon"></i>'
            
            html += `
                <th class="${rowClass}">${reserveIcon}</th>
                <th class="${rowClass}">${editIcon}</th>
                <th class="${rowClass}">${cancelIcon}</th>
                <th class="${rowClass}">${studentsIcon}</th>
            `
        }

        html += `</tr>`

        bodyEvents.innerHTML = html

    })

    await addEventsEventListeners(dataToPrint)

    eventsLoader.style.display = 'none'
}

async function addEventsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const reserve = document.getElementById('reserve_' + element.id)
        const cancel = document.getElementById('cancel_' + element.id)
        const editR = document.getElementById('editR_' + element.id)
        const editE = document.getElementById('editE_' + element.id)
        const deleteE = document.getElementById('deleteE_' + element.id)
        const admStudents = document.getElementById('admStudents_' + element.id)
        const custStudents = document.getElementById('custStudents_' + element.id)
        const companies = document.getElementById('companies_' + element.id)

        //reserve quota
        const inputs = [reserve,editR]
        inputs.forEach(input => {
            if(input){                                
                input.addEventListener('click',async()=>{
                    completeNextEventsGlobals(element)
                    if (input.id.split('_')[0] == 'reserve') {
                            rqppMainTitle.innerText = 'RESERVAR CUPO'
                            clearInputs([rqppQuota])
                            isValid([rqppQuota])
                            rqppAccept.innerText = 'Reservar'
                            rqppDivCompany.style.display = 'none'
                            eg.editReservationType = 'reserve'
                    }else{
                        rqppMainTitle.innerText = 'EDITAR RESERVA'
                        rqppQuota.value = element.companyReservations
                        rqppAccept.innerText = 'Editar'
                        eg.editReservationType = 'edit'
                        rqppDivCompany.style.display = 'none'
                        eg.idQuoteToCancel = 0
                        crppAlertText.innerText = ''
                        crppAlert.style.display = 'none'
                    }

                    eg.idCompanyToEdit = eg.idCompanies
                    eg.editReservationFrom = 'customer'
                    isValid([rqppQuota])
                    rqpp.style.display = 'block'
                })
            }            
        })
        
        //cancel reservation
        if (cancel) {
            cancel.addEventListener('click',async()=>{
                eg.idCompanyToEdit = eg.idCompanies
                eg.editReservationFrom = 'customer'
                completeNextEventsGlobals(element)
                clickCancel(element)
            })
        }

        // //students
        // if (students) {
        //     students.addEventListener('click',async()=>{
        //         completeNextEventsGlobals(element)
        //         const reservations = eg.studentsFrom == 'customer' ? element.companyReservations : element.eventReservations
        //         const assignations = eg.studentsFrom == 'customer' ? element.companyAssignations : element.eventAssignations
        //         const stppART = document.getElementById('stppART')
        //         const stppCheckbox = document.getElementById('stppCheckbox')
        //         const stppAcceptCheckbox = document.getElementById('stppAcceptCheckbox')
        //         const stppAcceptConditions = document.getElementById('stppAcceptConditions')
        //         const stppMedicalCert = document.getElementById('stppMedicalCert')
        //         const inputs = [stppLastName,stppFirstName,stppART,stppDNI,stppCheckbox,stppAcceptCheckbox]
        //         isValid(inputs)
        //         clearInputs(inputs)
        //         uncheckInputs([stppAcceptConditions,stppMedicalCert])
        //         stppError.style.display = 'none'
        //         stppError2.style.display = 'none'
        //         stppMainTitle.innerText = element.events_courses.course_name
        //         stppSubtitle.innerHTML = '<b>Fecha:</b> ' + dateToString(element.start_date) + ' - ' + dateToString(element.end_date) + ' || ' + element.start_time.substring(0,5) + 'hs. a ' + element.end_time.substring(0,5) + 'hs.'
        //         stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + reservations + ' || <b>Cupos asignados: </b>' + assignations
    
        //         if (eg.studentsFrom == 'administrator') {
        //             isValid([stppCompany])
        //             stppCompany.innerHTML = '<option value="">Todas las instituciones</option>'
        //             eg.eventCompanies.forEach(company => {
        //                 const companyName = eg.companies.filter(c => c.id == company)[0].company_name                    
        //                 stppCompany.innerHTML += '<option value="' + company + '">' + companyName + '</option>'                
        //             })
        //             stppText.style.display = 'none'
        //         }else{
        //             stppText.style.display = 'block'
        //         }

        //         printStudents(eg.eventStudents)
        //         stpp.style.display = 'block'
        //     })
        // }

        //students
        if (custStudents) {
            custStudents.addEventListener('click',async()=>{
                completeNextEventsGlobals(element)
                const reservations = element.companyReservations
                const assignations = element.companyAssignations
                const inputs = [cstppLastName,cstppFirstName,cstppART,cstppDNI,cstppCheckbox,cstppAcceptCheckbox]
                isValid(inputs)
                clearInputs(inputs)
                uncheckInputs([cstppAcceptConditions,cstppMedicalCert])
                cstppError.style.display = 'none'
                cstppError2.style.display = 'none'
                cstppMainTitle.innerText = element.events_courses.course_name
                cstppSubtitle.innerHTML = '<b>Fecha:</b> ' + dateToString(element.start_date) + ' - ' + dateToString(element.end_date) + ' || ' + element.start_time.substring(0,5) + 'hs. a ' + element.end_time.substring(0,5) + 'hs.'
                cstppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + reservations + ' || <b>Cupos asignados: </b>' + assignations
    
                cstppText.style.display = 'block'

                printStudents(eg.eventStudents)
                cstpp.style.display = 'block'
            })
        }
        

        //companies
        if (companies) {
            companies.addEventListener('click',async()=>{
                completeNextEventsGlobals(element)
                coppMainTitle.innerText = element.events_courses.course_name
                coppSubtitle.innerHTML = '<b>Fecha:</b> ' + dateToString(element.start_date) + ' - ' + dateToString(element.end_date) + ' || ' + element.start_time.substring(0,5) + 'hs. a ' + element.end_time.substring(0,5) + 'hs.'
                printCompanies(eg.eventCompanies,element)                
                copp.style.display = 'block'
            })
        }

        //edit event
        if (editE) {
            editE.addEventListener('click',async()=>{
                completeNextEventsGlobals(element)
                ceppTitle.innerText = eg.eventCourseName
                ceppSubtitle.innerText = 'EDITAR EVENTO'
                ceppStartDate.value = element.start_date
                ceppEndDate.value = element.end_date
                ceppStartTime.value = element.start_time
                ceppEndTime.value = element.end_time
                ceppEventQuota.value = element.event_quota

                if (eg.companies.length == eg.eventInvitedCompanies.length) {
                    ceppAllCompanies.checked = true                    
                }else{
                    ceppAllCompanies.checked = false
                }

                clickCompanies()
                
                //delete errors
                isValid([ceppStartDate,ceppEndDate,ceppStartTime,ceppEndTime,ceppEventQuota])
                ceppDateError.style.display = 'none'
                ceppTimeError.style.display = 'none'
                ceppCompaniesError.style.display = 'none'

                //show popup
                cepp.style.display = 'block'
            })
        }
        
        //delete event
        if (deleteE) {
            deleteE.addEventListener('click',async()=>{

                if (element.eventReservations > 0) {
                    showOkPopup(deppError)
                }else{
                    eg.idEvents = element.id
                    deppQuestion.innerHTML = '¿Confirma que desea eliminar el evento <b>#' + String(element.id).padStart(8,'0') + '</b> del curso <b>' + element.events_courses.course_name + ' </b> con fecha de inicio ' + dateToString(element.start_date) + '?'
                    depp.style.display = 'block'
                }
            })
        } 
    })
}

export {printEvents}