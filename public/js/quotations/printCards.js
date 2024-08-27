import qg from "./qGlobals.js"
import {dateToString } from "../generalFunctions.js"
import {printTableQuotation } from "./printTables.js"
import {completeQuotationStatus } from "./functions.js"

async function printQuotations(dataToPrint) {

    quotationsLoader.style.display = 'block'
    divQuotations.innerHTML = ''

    if (dataToPrint.length == 0) {
        noQuotationsToShow.style.display = 'flex'
        divQuotations.style.display = 'none'
    }else{
        noQuotationsToShow.style.display = 'none'
        divQuotations.style.display = 'flex'

        const fragment = document.createDocumentFragment()

        dataToPrint.forEach(element => {

            //get data
            const startTime = element.event.start_time.substring(0, 5)
            const endTime = element.event.end_time.substring(0, 5)
            const eventNumber = 'Evento: #' + String(element.id_events).padStart(8, '0')
            const eventDate = dateToString(element.event.start_date) + ' - ' + dateToString(element.event.end_date) + ' || ' + startTime + ' a ' + endTime + ' hs.'
            const reservations = qg.reservationsPerCompany.filter( r => r.id_events == element.id_events && r.id_companies == element.id_companies)
            const reservationsText = 'Cupos reservados: ' + (reservations.length == 0 ? 0 : reservations[0].total_quota_reservations)
    
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
            qReservations.textContent = reservationsText
    
            const qStatus = document.createElement('div')
            qStatus.id = 'qStatus'
            
            //add error color if company has to aprove quotation
            if (qg.idUsersCategories == 4 && element.quotation != null) {
                if (element.quotation.id_status == 2) {
                    qStatus.classList.add('errorColor')                
                }
            }
            
            if (qg.idUsersCategories != 4) {
                qStatus.innerHTML = element.quotation_status.status
            }else{
                qStatus.innerHTML = (element.id_quotations_status == 4 || element.id_quotations_status == 3) ? 'Pendiente' : 'En aprobación'
            }
            
            const qRequiresQuotation = document.createElement('div')
            qRequiresQuotation.id = 'qRequiresQuotation'
            qRequiresQuotation.innerHTML = '<div class="quotationCheckbox"><input type="checkbox" id="noQuotation_' + element.id + '"><label>No requiere cotización</label></div>'
    
            const qSelect = document.createElement('div')
            qSelect.id = 'qSelect'
            qSelect.innerHTML = '<div><input type="checkbox" class="qSelect" id="select_' + element.id + '"></div>'
            
            //create actions div
            const qActions = document.createElement('div')
            qActions.id = 'qActions'
    
            const qDetails = document.createElement('div')
            qDetails.className = 'qAction'
            qDetails.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus icon" id="view_' + element.id + '"></i><div class="qActionInfo">Ver cotización</div>'
    
            const qDelete = document.createElement('div')
            qDelete.className = 'qAction'
            qDelete.innerHTML = '<i class="fa-regular fa-trash-can icon" id="delete_' + element.id + '"></i><div class="qActionInfo">Cancelar cotización</div>'
            
            divQuotation.appendChild(qCompanyName)
            divQuotation.appendChild(qCourseName)
            divQuotation.appendChild(qEvent)
            divQuotation.appendChild(qEventData)
            divQuotation.appendChild(qReservations)
            divQuotation.appendChild(qStatus)
            divQuotation.appendChild(qActions)
            
            if (qg.idUsersCategories != 4 && element.quotation == null) {
                divQuotation.appendChild(qRequiresQuotation)
                divQuotation.appendChild(qSelect)
            }
    
            if (element.quotation != null && (qg.idUsersCategories != 4 || element.quotation.id_status == 2)) {
                qActions.appendChild(qDetails)
            }
    
            if (element.quotation != null && qg.idUsersCategories != 4) {
                qActions.appendChild(qDelete)
            }
    
            fragment.appendChild(divQuotation)
            
        })
    
        divQuotations.appendChild(fragment)
        quotationsTableData.style.right = qg.idUsersCategories != 4 ? '6%' : '12%'
        await quotationsEventListeners(dataToPrint)
        
    }
    
    quotationsLoader.style.display = 'none';
}

async function quotationsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const noQuotation = document.getElementById('noQuotation_' + element.id)
        const select = document.getElementById('select_' + element.id)
        const view = document.getElementById('view_' + element.id)
        const deleteQ = document.getElementById('delete_' + element.id)

        //notQuotation
        if (noQuotation) {
            noQuotation.addEventListener('click',async()=>{
                qg.elementToEdit = element
                nqppQuestion.innerHTML = '¿Confirma que desea marcar como "Sin cotización requerida" a la reserva del evento <b>#' + String(element.id_events).padStart(8, '0') + ' </b>hecha por la empresa <b>' + element.company.company_name + '</b>?'
                nqpp.style.display = 'block'
            })
        }

        //select
        if (select) {
            select.addEventListener('click',async()=>{
                if (select.checked) {    
                    qg.selectedElements.push(element)    
                }else{
                    qg.selectedElements = qg.selectedElements.filter(se => se.id != element.id)
                }
    
                if (qg.selectedElements.length > 0) {   
                    qQuote.classList.remove('qQuoteUnabled')
                    qQuote.classList.add('qQuoteEnabled')                
                }else{
                    qQuote.classList.add('qQuoteUnabled')
                    qQuote.classList.remove('qQuoteEnabled') 
                }
            })
        }

        //view
        if (view) {
            view.addEventListener('click',async()=>{
                qg.editFrom = 'edit'
                qg.companyData = element.company
                qg.idQuotationToEdit = element.id_quotations
                qg.quotationNumber = element.quotation.quotation_number
                qg.quotationData.discount = element.quotation.discount

                cqppMainTitle.innerText = element.company.company_name
                cqppSubtitle.innerText = 'Cotización #' + String(element.quotation.quotation_number).padStart(6,'0')
                cqppError2.style.display = 'none'

                qg.elementsToQuote = []

                element.quotation.quotations_details.forEach(detail => {
                    qg.elementsToQuote.push({
                        id:detail.id,
                        id_events:detail.id_events,
                        description: detail.description,
                        unit_price:detail.unit_price,
                        quantity:detail.quantity,
                        subtotal:detail.subtotal,
                        id_companies:qg.companyData.id,
                        discount:detail.discount,
                        total:detail.total,
                        companyData:qg.companyData,
                        eventData:detail.event,
                        type:detail.id_events == null ? 2 : 1
                    })                    
                })

                qg.elementsToQuote.sort((a, b) => a.type - b.type)
                printTableQuotation(qg.elementsToQuote)

                completeQuotationStatus(element.quotation_status.status,element.id_quotations_status)

                cqpp.style.display = 'block'
            })
        }

        //delete
        if (deleteQ) {
            deleteQ.addEventListener('click',async()=>{
                
                qg.idQuotationToEdit = element.id_quotations

                dqppQuestion.innerHTML = '¿Confirma que desea eliminar la cotización <b>#' + String(element.quotation.quotation_number).padStart(6,'0') + '</b> del cliente <b>' + element.company.company_name + '</b> ?'

                qg.elementsToCancel = []

                element.quotation.quotations_details.forEach(detail => {
                    qg.elementsToCancel.push({
                        id:detail.id,
                    })                    
                })

                dqpp.style.display = 'block'
                
            })
        }
        
    })
}

export {printQuotations}