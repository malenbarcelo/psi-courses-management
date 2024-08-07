import qg from "./quotationsGlobals.js"
import {dateToString } from "../generalFunctions.js"

async function printQuotations(dataToPrint) {

    quotationsLoader.style.display = 'block'
    divQuotations.innerHTML = ''
    const fragment = document.createDocumentFragment()

    dataToPrint.forEach(element => {

        //get data
        const startTime = element.event.start_time.substring(0, 5)
        const endTime = element.event.end_time.substring(0, 5)
        const eventNumber = 'Evento: #' + String(element.id_events).padStart(8, '0')
        const eventDate = dateToString(element.event.start_date) + ' - ' + dateToString(element.event.end_date) + ' || ' + startTime + ' a ' + endTime + ' hs.'
        const reservations = 'Cupos reservados: ' + qg.reservationsPerCompany.filter( r => r.id_events == element.id_events && r.id_companies == element.id_companies)[0].total_quota_reservations        

        //create quotation div                
        const divQuotation = document.createElement('div')
        divQuotation.id = 'divQuotation'

        //create quotation info
        const qCompanyName = document.createElement('div')
        qCompanyName.id = 'qCompanyName'
        qCompanyName.textContent = element.company.company_name

        const qCourseName = document.createElement('div')
        qCourseName.id = 'qCourseName'
        qCourseName.textContent = element.event.events_courses.course_name

        const qEvent = document.createElement('div')
        qEvent.id = 'qEvent'
        qEvent.textContent = eventNumber

        const qEventData = document.createElement('div')
        qEventData.id = 'qEventData'
        qEventData.textContent = eventDate

        const qReservations = document.createElement('div')
        qReservations.id = 'qReservations'
        qReservations.textContent = reservations
        
        const qActions = document.createElement('div')
        qActions.id = 'qActions'

        const qStatus = document.createElement('div')
        qStatus.id = 'qStatus'
        qStatus.innerHTML = element.quotation == null ? 'Pendiente' : 'Revisar'

        const qRequiresQuotation = document.createElement('div')
        qRequiresQuotation.id = 'qRequiresQuotation'
        qRequiresQuotation.innerHTML = '<div class="quotationCheckbox"><input type="checkbox" id="noQuotation_' + element.id + '"><label>No requiere cotización</label></div>'

        const qSelect = document.createElement('div')
        qSelect.id = 'qSelect'
        qSelect.innerHTML = '<div><input type="checkbox" class="qSelect" id="select_' + element.id + '"></div>'

        // const editEventAction = document.createElement('div');
        // editEventAction.className = element.status == 'finished' ? 'courseAction notVisible' : 'courseAction';
        // editEventAction.innerHTML = '<i class="fa-regular fa-pen-to-square icon" id="editE_' + element.id + '"></i><div class="courseActionInfo2">Editar evento</div>';
        
        // const editReservationAction = document.createElement('div');
        // editReservationAction.className = element.companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        // editReservationAction.innerHTML = '<i class="fa-regular fa-pen-to-square icon" id="editR_' + element.id + '"></i><div class="courseActionInfo2">Editar reserva</div>';

        // const cancelAction = document.createElement('div');
        // cancelAction.className = element.companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        // cancelAction.innerHTML = '<i class="fa-regular fa-circle-xmark icon" id="cancel_' + element.id + '"></i><div class="courseActionInfo2">Cancelar reserva</div>';

        // const studentsAction = document.createElement('div');
        // studentsAction.className = ((eg.idUserCategories == 4 && element.companyReservations == 0) || (eg.idUserCategories != 4 && element.eventReservations == 0)) ? 'courseAction notVisible' : 'courseAction';
        // studentsAction.innerHTML = '<i class="fa-solid fa-user icon" id="students_' + element.id + '"></i><div class="courseActionInfo2">Alumnos</div>';

        // const companiesAction = document.createElement('div');
        // companiesAction.className = 'courseAction';
        // companiesAction.innerHTML = '<i class="fa-solid fa-industry icon" id="companies_' + element.id + '"></i><div class="courseActionInfo2">Empresas</div>';

        // const reserveAction = document.createElement('div');
        // reserveAction.className = element.companyReservations != 0 ? 'courseAction notVisible' : 'courseAction';
        // reserveAction.innerHTML = '<i class="fa-solid fa-user-plus icon" id="reserve_' + element.id + '"></i><div class="courseActionInfo2">Reservar cupo</div>';

        // const alert = document.createElement('div');
        // alert.className = missingAssignations ? 'eventAlert' : 'notVisible';
        // alert.innerHTML = '<i class="fa-solid fa-triangle-exclamation icon" id="alert_' + element.id + '"></i><div class="courseActionInfo3">Cupos reservados pendientes de asignación</div>';

        // if (eg.idUserCategories == 4) {
        //     eventActions.appendChild(editReservationAction);
        //     eventActions.appendChild(cancelAction);
        //     eventActions.appendChild(studentsAction);
        //     eventActions.appendChild(reserveAction);
        //     eventActions.appendChild(alert);
        // }else{
        //     eventActions.appendChild(editEventAction);
        //     eventActions.appendChild(studentsAction);
        //     eventActions.appendChild(companiesAction);
        //     eventActions.appendChild(alert);
        // }        
        
        divQuotation.appendChild(qCompanyName)
        divQuotation.appendChild(qCourseName)
        divQuotation.appendChild(qEvent)
        divQuotation.appendChild(qEventData)
        divQuotation.appendChild(qReservations)
        divQuotation.appendChild(qActions)
        divQuotation.appendChild(qStatus)
        divQuotation.appendChild(qRequiresQuotation)
        divQuotation.appendChild(qSelect)

        fragment.appendChild(divQuotation)
            
        
    })

    divQuotations.appendChild(fragment)

    await quotationsEventListeners(dataToPrint);

    quotationsLoader.style.display = 'none';
}

async function quotationsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const noQuotation = document.getElementById('noQuotation_' + element.id)
        const select = document.getElementById('select_' + element.id)

        //notQuotation
        noQuotation.addEventListener('click',async()=>{
            qg.elementToEdit = element
            nqppQuestion.innerHTML = '¿Confirma que desea marcar como "Sin cotización requerida" a la reserva del evento <b>#' + String(element.id_events).padStart(8, '0') + ' </b>hecha por la empresa <b>' + element.company.company_name + '</b>?'
            nqpp.style.display = 'block'
        })

        //select
        select.addEventListener('click',async()=>{
            if (select.checked) {

                qg.selectedElements.push(element)

                const maxId = qg.elementsToQuote.length == 0 ? 0 : qg.elementsToQuote.reduce((max, obj) => (obj.id > max ? obj.id : max), qg.elementsToQuote[0].id)

                qg.elementsToQuote.push({
                    id:maxId + 1,
                    description: element.event.events_courses.course_name + ' - Evento #' + String(element.id_events).padStart(8,'0'),
                    price:'',
                    quantity:parseInt(qg.reservationsPerCompany.filter(r => r.id_events == element.id_events && r.id_companies == element.id_companies)[0].total_quota_reservations),
                    extended_price:'',
                    discount:'',
                    net_extended_price:'',
                    data:element
                })

            }else{
                qg.selectedElements = qg.selectedElements.filter(se => se.id != element.id)
                qg.elementsToQuote = qg.elementsToQuote.filter(eq => eq.data.id != element.id)
            }

            if (qg.selectedElements.length > 0) {   
                qQuote.classList.remove('qQuoteUnabled')
                qQuote.classList.add('qQuoteEnabled')                
            }else{
                qQuote.classList.add('qQuoteUnabled')
                qQuote.classList.remove('qQuoteEnabled') 
            }
        })
    })
}

export {printQuotations}