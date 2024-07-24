import { dominio } from "../dominio.js"
import eg from "./eventsGlobals.js"
import {isInvalid,isValid,dateToString,clearInputs, inputsValidation } from "../generalFunctions.js"

async function printEvents(dataToPrint) {

    eventsLoader.style.display = 'block'

    divEvents.innerHTML = ''

    const fragment = document.createDocumentFragment()

    dataToPrint.forEach(element => {

        //get data
        const startTime = element.start_time.substring(0, 5)
        const endTime = element.end_time.substring(0, 5)
        const availableQuota = element.event_quota - element.eventReservations
        const reservations = eg.idUserCategories == 4 ? element.companyReservations : element.eventReservations
        const assignations = eg.idUserCategories == 4 ? element.eventAssignations : element.companyAssignations
        const missingAssignations = reservations - assignations
        
        const divEvent = document.createElement('div');
        divEvent.id = 'divEvent';

        const eventCourseTitle = document.createElement('div');
        eventCourseTitle.id = 'eventCourseTitle';
        eventCourseTitle.textContent = element.events_courses.course_name

        const eventId = document.createElement('div');
        eventId.id = 'eventId';
        eventId.textContent = '#' + String(element.id).padStart(8, '0')

        const eventData = document.createElement('div');
        eventData.id = 'eventData';
        eventData.innerHTML = '<div>' + dateToString(element.start_date) + ' - ' + dateToString(element.end_date) + '</div><div>' + startTime + ' a ' + endTime + ' hs.</div>';

        const eventInfo = document.createElement('div');
        eventInfo.id = 'eventInfo';
        eventInfo.innerHTML = '<div>Disponible: ' + availableQuota + '</div><div>Reservado: ' + reservations + '</div><div>Asignado: ' + assignations + '</div>';

        const eventActions = document.createElement('div');
        eventActions.id = 'eventActions';

        const onCourse = document.createElement('div');
        onCourse.id = 'onCourse';
        onCourse.innerHTML = element.status == 'onCourse' ? 'En curso' : element.status == 'finished' ? 'Finalizado' : 'Por comenzar';
        
        const editAction = document.createElement('div');
        editAction.className = element.companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        editAction.innerHTML = '<i class="fa-regular fa-pen-to-square icon" id="edit_' + element.id + '"></i><div class="courseActionInfo2">Editar reserva</div>';

        const cancelAction = document.createElement('div');
        cancelAction.className = element.companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        cancelAction.innerHTML = '<i class="fa-regular fa-circle-xmark icon" id="cancel_' + element.id + '"></i><div class="courseActionInfo2">Cancelar reserva</div>';

        const studentsAction = document.createElement('div');
        studentsAction.className = element.companyReservations == 0 ? 'courseAction notVisible' : 'courseAction';
        studentsAction.innerHTML = '<i class="fa-solid fa-user icon" id="students_' + element.id + '"></i><div class="courseActionInfo2">Alumnos</div>';

        const reserveAction = document.createElement('div');
        reserveAction.className = element.companyReservations != 0 ? 'courseAction notVisible' : 'courseAction';
        reserveAction.innerHTML = '<i class="fa-solid fa-user-plus icon" id="reserve_' + element.id + '"></i><div class="courseActionInfo2">Reservar cupo</div>';

        const alert = document.createElement('div');
        alert.className = missingAssignations ? 'eventAlert' : 'notVisible';
        alert.innerHTML = '<i class="fa-solid fa-triangle-exclamation icon" id="alert_' + element.id + '"></i><div class="courseActionInfo3">Tiene cupos pendientes de asignación</div>';

        eventActions.appendChild(editAction);
        eventActions.appendChild(cancelAction);
        eventActions.appendChild(studentsAction);
        eventActions.appendChild(reserveAction);
        eventActions.appendChild(alert);
        
        divEvent.appendChild(eventCourseTitle);
        divEvent.appendChild(eventId);
        divEvent.appendChild(eventData);
        divEvent.appendChild(eventInfo);
        divEvent.appendChild(eventActions);
        divEvent.appendChild(onCourse);
        fragment.appendChild(divEvent);
            
        
    });

    divEvents.appendChild(fragment);

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
                completeNextEventsGlobals(element)
                if (input.id.split('_')[0] == 'reserve') {
                    rqppMainTitle.innerText = 'RESERVAR CUPO'
                    clearInputs([rqppQuota])
                    isValid([rqppQuota])
                    rqppAccept.innerText = 'Reservar'
                    eg.editReservationType = 'reserve'                    
                }else{
                    rqppMainTitle.innerText = 'EDITAR RESERVA'
                    rqppQuota.value = element.companyReservations
                    rqppAccept.innerText = 'Editar'
                    eg.editReservationType = 'edit'  
                }

                rqpp.style.display = 'block'
            })
        })
        
        //cancel reservation
        cancel.addEventListener('click',async()=>{
            completeNextEventsGlobals(element)
            creppQuestion.innerHTML = '¿Confirma que desea cancelar la reserva del curso <b>' + element.events_courses.course_name + '</b> que se dictará el <b>' + dateToString(element.start_date) + '</b>?'
            crepp.style.display = 'block'
        })

        //students
        students.addEventListener('click',async()=>{
            completeNextEventsGlobals(element)
            const inputs = [stppLastName,stppFirstName,stppEmail,stppDNI]
            isValid(inputs)
            stppError.style.display = 'none'
            stppMainTitle.innerText = element.events_courses.course_name
            stppSubtitle.innerHTML = '<b>Fecha:</b> ' + dateToString(element.start_date) + ' - ' + dateToString(element.end_date) + ' || ' + element.start_time.substring(0,5) + 'hs. a ' + element.end_time.substring(0,5) + 'hs.'
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + element.companyReservations + ' || <b>Cupos asignados: </b>' + element.companyAssignations
            printStudents(eg.eventStudents)
            stpp.style.display = 'block'
        })
    })
}

function completeNextEventsGlobals(element) {
    eg.idEvents = element.id
    eg.eventCourseName = element.events_courses.course_name
    eg.idCourses = element.id_courses
    eg.companyReservations = element.companyReservations
    eg.eventStudents = eg.idUserCategories == 4 ? element.events_students.filter(es => es.id_companies == eg.idCompany && es.enabled == 1) : element.events_students.filter(es => es.enabled == 1)
    
}

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
        if (filterFinished.checked) {
            checkedElements.push('finished')
        }
        if (filterOnCourse.checked) {
            checkedElements.push('onCourse')
        }
        if (filterPending.checked) {
            checkedElements.push('pending')
        }
        eg.eventsFiltered = (checkedElements.length == 0 || checkedElements.length == 3) ? eg.eventsFiltered : eg.eventsFiltered.filter(e => checkedElements.includes(e.status))

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
        if (rqppQuota.value > eg.eventAvailableQuota) {
            rqppQuotaError.innerText = 'Se puede reservar una cantidad máxima de ' + eg.eventAvailableQuota + ' cupos'
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
        if (rqppQuota.value > (eg.eventAvailableQuota + eg.companyReservationsQty)) {
            rqppQuotaError.innerText = 'Se puede reservar una cantidad máxima de ' + (eg.eventAvailableQuota + eg.companyReservationsQty) + ' cupos'
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

async function uploadExcelValidations() {

    let errors = 0
    let data = []

    const file = ueppFile.files[0]

    if (!file) {
        errors += 1
        isInvalid([ueppDivInput])
        ueppFileError.innerText = 'Debe seleccionar un archivo'
        ueppFileError.style.display = 'block'        
    }else{

        const fileName = file.name;
        const fileExtension = fileName.split('.').pop()

        if (fileExtension != 'xlsx' && fileExtension != 'xls') {
            errors +=1
            ueppFileError.innerText = 'Las extensiones permitidas son ".xlsx" y ".xls"'
        }else{
            const formData = new FormData()
            formData.append('ueppFile', ueppFile.files[0])

            const response = await fetch('/apis/events-students/read-excel-file', {
                method: 'POST',
                body: formData
                })

            data = await response.json()
            data.shift()

            if (eg.companyReservationsQty < (eg.eventAssignedStudents.length + data.length)) {
                errors += 1
                ueppFileError.innerText = 'Supera la cantidad de cupos reservados'                
            }

            if (errors == 0) {
                data.forEach(row => {
                    if (row.includes(null) || row.includes('')) {
                        errors +=1
                        ueppFileError.innerText = 'Se detectaron campos vacíos en el archivo'
                    }
                })
            }

            if (errors == 0) {
                const dnis = data.map(subArray => String(subArray[3]))
                const uniqueDnis = [...new Set(dnis)]

                if (dnis.length != uniqueDnis.length) {
                    errors +=1
                    ueppFileError.innerText = 'Se detectaron DNIs duplicados en el archivo'
                }else{
                    const assignedDnis = eg.eventAssignedStudents.map(students => students.dni)
                    
                    const set1 = new Set(dnis)
                    const set2 = new Set(assignedDnis)                    

                    const repeatedDnis = [...set1].filter(dni => set2.has(dni))

                    if (repeatedDnis.length > 0) {
                        errors +=1
                        ueppFileError.innerText = 'Se detectaron DNIs ya asignados en el archivo'
                    }
                }
            }
        }
    }

    if (errors > 0) {
        isInvalid([ueppDivInput])
        ueppFileError.style.display = 'block'
    }

    return {data,errors}
}

function addStudentValidations() {

    const inputs = [stppLastName,stppFirstName,stppEmail,stppDNI]
    let errors = inputsValidation(inputs)

    if (errors == 0) {
        const findDNI  = eg.eventStudents.filter(s => s.dni == stppDNI.value)
        if (findDNI.length > 0 ) {
            errors += 1
            stppError.innerText = 'Ya existe en la lista un alumno con el DNI ' + stppDNI.value
            isInvalid([stppDNI])
        }else{
            isValid([stppDNI])
            stppError.style.display = 'none'
        }
    }else{
        stppError.innerText = 'Debe complear todos los datos'
    }

    if (errors > 0) {
        stppError.style.display = 'block'
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

    addStudentsEventListeners(dataToPrint)

    studentsLoader.style.display = 'none'
}

async function addStudentsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const deleteStudent = document.getElementById('delete_' + element.id)

        //delete students
        deleteStudent.addEventListener('click',async()=>{
            dsppQuestion.innerHTML = '¿Confirma que desea eliminar al alumno <b>' + element.last_name + ' ' + element.first_name + '</b>?'
            eg.idStudentToDelete = element.id
            dspp.style.display = 'block'
        })
        
    })
}





export {printEvents,filterEvents,reserveQuotaValidations,editQuotaValidations,addStudentValidations,printStudents,uploadExcelValidations}