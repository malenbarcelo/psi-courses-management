import { dominio } from "../dominio.js"
import eg from "./globals.js"
import {isValid,dateToString,clearInputs, showOkPopup, uncheckInputs } from "../generalFunctions.js"
import { printCompanies } from "./printEventCompanies.js"
import { printStudents } from "./printEventStudents.js"
import { completeNextEventsGlobals, clickCompanies, clickCancel } from "./functions.js"

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
                printStudents(eg.eventStudents,astppLoader,cstppBody)
                cstpp.style.display = 'block'
            })
        }

        //adm students
        if (admStudents) {
            admStudents.addEventListener('click',async()=>{
                completeNextEventsGlobals(element)
                const reservations = element.eventReservations
                const assignations = element.eventAssignations
                const inputs = [astppCompany,astppLastName,astppFirstName,astppART,astppDNI,astppAcceptCheckbox]
                isValid(inputs)
                clearInputs(inputs)
                uncheckInputs([astppAcceptConditions])
                astppError.style.display = 'none'
                astppError2.style.display = 'none'
                astppMainTitle.innerText = element.events_courses.course_name
                astppSubtitle.innerHTML = '<b>Fecha:</b> ' + dateToString(element.start_date) + ' - ' + dateToString(element.end_date) + ' || ' + element.start_time.substring(0,5) + 'hs. a ' + element.end_time.substring(0,5) + 'hs.'
                astppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + reservations + ' || <b>Cupos asignados: </b>' + assignations
                astppText.style.display = 'block'
                printStudents(eg.eventStudents,astppLoader,astppBody)

                //complete companies
                astppCompany.innerHTML = '<option value="">Todas las instituciones</option>'
                eg.eventCompanies.forEach(company => {
                    const companyName = eg.companies.filter(c => c.id == company)[0].company_name                    
                    astppCompany.innerHTML += '<option value="' + company + '">' + companyName + '</option>'                
                })

                astpp.style.display = 'block'
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