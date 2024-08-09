import qg from "./qGlobals.js"
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

        const qStatus = document.createElement('div')
        qStatus.id = 'qStatus'
        qStatus.innerHTML = element.quotation == null ? 'Pendiente' : element.quotation.quotations_status.status
        
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
        qDetails.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus icon" id="details_' + element.id + '"></i><div class="qActionInfo">Ver cotización</div>'
        
        divQuotation.appendChild(qCompanyName)
        divQuotation.appendChild(qCourseName)
        divQuotation.appendChild(qEvent)
        divQuotation.appendChild(qEventData)
        divQuotation.appendChild(qReservations)
        divQuotation.appendChild(qStatus)
        divQuotation.appendChild(qActions)
        
        if (element.quotation == null) {
            divQuotation.appendChild(qRequiresQuotation)
            divQuotation.appendChild(qSelect)
        }else{
            qActions.appendChild(qDetails)
        }

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
        }
        
    })
}

export {printQuotations}