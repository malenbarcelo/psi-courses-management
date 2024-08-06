import qg from "./quotationsGlobals.js"

async function printTableQuotation(dataToPrint) {

    bodyQuotations.innerHTML = ''
    let counter = 0

    let html = ''

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const reservations = qg.reservationsPerCompany.filter(r => r.id_events == element.id_events && r.id_companies == element.id_companies)[0].total_quota_reservations
        
        html += `
            <tr>
                <th class="${rowClass}">${element.event.events_courses.course_name}</th>
                <th class="${rowClass}">${'#' + String(element.id_events).padStart(8,'0')}</th>
                <th class="${rowClass}">${reservations}</th>
                <th class="${rowClass}"></th>
                <th class="${rowClass}"></th>
                <th class="${rowClass}"></th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
            </tr>
        `
        
        counter += 1
    })

    bodyQuotations.innerHTML += html

    tableQuotationEventListeners(dataToPrint)
    
}

async function tableQuotationEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const deleteLine = document.getElementById('delete_' + element.id)
        const edit = document.getElementById('edit_' + element.id)

        //delete line
        deleteLine.addEventListener('click',async()=>{
            qg.eventsToQuote = qg.eventsToQuote.filter(se => se.id != element.id)
            printTableQuotation(qg.eventsToQuote)
            
        })

        //edit
        // edit.addEventListener('click',async()=>{
        //     if (select.checked) {
        //         qg.selectedElements.push(element)
        //     }else{
        //         qg.selectedElements = qg.selectedElements.filter(se => se.id != element.id)
        //     }

        //     if (qg.selectedElements.length > 0) {   
        //         qQuote.classList.remove('qQuoteUnabled')
        //         qQuote.classList.add('qQuoteEnabled')                
        //     }else{
        //         qQuote.classList.add('qQuoteUnabled')
        //         qQuote.classList.remove('qQuoteEnabled') 
        //     }
        // })
    })
}



export {printTableQuotation}