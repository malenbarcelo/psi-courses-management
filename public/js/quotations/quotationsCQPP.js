import { dominio } from "../dominio.js"
import { showOkPopup } from "../generalFunctions.js"
import qg from "./qGlobals.js"
import { printQuotations } from "./printCards.js"
import { printTableQuotation } from "./printTables.js"

//CREATE QUOTE POPUP
async function cqppEventListeners() {
    
    //cqppAddEvent (create quotation popup event)
    cqppAddEvent.addEventListener("click", async() => {

        const elementsToQuoteIds = qg.elementsToQuote.map(eq => eq.data.id)
        const eventsToAdd = qg.quotations.filter(q => q.id_companies == qg.companyData.id_companies && !elementsToQuoteIds.includes(q.id))

        aeppEvent.innerHTML = '<option value=""></option>'

        eventsToAdd.forEach(element => {
            const eventToAdd = element.event.events_courses.course_name + ' - Evento #' + String(element.id_events).padStart(8,'0')
            aeppEvent.innerHTML += '<option value="' + element.id + '">' + eventToAdd + '</option>'
            
        })       
        aepp.style.display = 'block'
        
    })
    
    //cqppNewLine (create quotation popup new line)
    cqppNewLine.addEventListener("click", async() => {
        alppDescription.value = ''
        alpp.style.display = 'block'        
    })

    //change discount (create quotation popup discount)
    cqppEditDiscount.addEventListener("click", async() => {
        edppDiscount.value = qg.quotationData.discount * 100
        edpp.style.display = 'block'
    })
    
    //save created quote  (edit line popup)
    cqppSave.addEventListener("click", async() => {
        
        const data = {
            quotationData:{
                quotation_number: qg.quotationNumber,
                subtotal:parseFloat(qg.quotationData.subtotal,2),
                discount:qg.quotationData.discount,
                total:qg.quotationData.total,
                id_status:3,
                enabled:1
            },
            quotationDetails:qg.elementsToQuote
        }

        quotationsLoader.style.display = 'block'

        await fetch(dominio + 'apis/quotations/save-quotation',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        qg.quotations = await (await fetch(dominio + 'apis/quotations/in-progress-quotations')).json()
        qg.quotationsFiltered = qg.quotations
        qg.quotationsData = await (await fetch(dominio + 'apis/quotations/quotations-data')).json()
        qg.selectedElements = []
        qg.elementsToQuote = []
        qQuote.classList.add('qQuoteUnabled')

        //print in progress quotations
        printQuotations(qg.quotationsFiltered)
        
        cqpp.style.display = 'none'

        showOkPopup(cqppOk)        

    })
    
}

export {cqppEventListeners}