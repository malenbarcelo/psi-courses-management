import { dominio } from "../dominio.js"
import { showOkPopup } from "../generalFunctions.js"
import qg from "./quotationsGlobals.js"
import { printQuotations } from "./quotationsPrintCards.js"
import { printTableQuotation } from "./quotationsPrintTables.js"

//NO QUOTATION POPUP
async function nqppEventListeners() {
    
    //nqppClose and nqppCancel
    const closeInputs = [nqppClose, nqppCancel]
    closeInputs.forEach(input => {
        input.addEventListener("click", async() => {
            const noQuotation = document.getElementById('noQuotation_' + qg.elementToEdit.id)
            noQuotation.checked = false
        })
    })

    //nqppAccept
    nqppAccept.addEventListener("click", async() => {        
        const data = qg.elementToEdit
        await fetch(dominio + 'apis/quotations/no-quotation-required',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        qg.quotations = await (await fetch(dominio + 'apis/quotations/in-progress-quotations')).json()
        qg.quotationsFiltered = qg.quotations    

        //print in progress quotations
        printQuotations(qg.quotationsFiltered)

        nqpp.style.display = 'none'

        showOkPopup(nqppOk)

    })
    

    
}

//CREATE QUOTE POPUP
async function cqppEventListeners() {
    
    //cqppAddEvent
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
    
    //aeppAccept
    aeppAccept.addEventListener("click", async() => {        

        if (aeppEvent.value != '') {                        
            
            const eventToAdd = qg.quotations.filter(q => q.id == aeppEvent.value)[0]

            const maxId = qg.elementsToQuote.length == 0 ? 0 : qg.elementsToQuote.reduce((max, obj) => (obj.id > max ? obj.id : max), qg.elementsToQuote[0].id)
            
            qg.elementsToQuote.push({
                id:maxId + 1,
                    description: eventToAdd.event.events_courses.course_name + ' - Evento #' + String(eventToAdd.id_events).padStart(8,'0'),
                    price:'',
                    quantity:parseInt(qg.reservationsPerCompany.filter(r => r.id_events == eventToAdd.id_events && r.id_companies == eventToAdd.id_companies)[0].total_quota_reservations),
                    extended_price:'',
                    discount:'',
                    net_extended_price:'',
                    data:eventToAdd
            })

            printTableQuotation(qg.elementsToQuote)
            aepp.style.display = 'none'
            
        }
        

    })

    //cqppNewLine
    cqppNewLine.addEventListener("click", async() => {
        alppDescription.value = ''
        alpp.style.display = 'block'        
    })

    //alppAccept
    alppAccept.addEventListener("click", async() => {        

        if (alppDescription.value != '') {

            const maxId = qg.elementsToQuote.length == 0 ? 0 : qg.elementsToQuote.reduce((max, obj) => (obj.id > max ? obj.id : max), qg.elementsToQuote[0].id)
            
            qg.elementsToQuote.push({
                id:maxId + 1,
                description: alppDescription.value,
                price:'',
                quantity:'',
                extended_price:'',
                discount:'',
                net_extended_price:'',
                data:[]
            })

            printTableQuotation(qg.elementsToQuote)
            
            alpp.style.display = 'none'
            
        }
        

    })

    //change discount
    cqppEditDiscount.addEventListener("click", async() => {
        edppDiscount.value = qg.quotationData.discount * 100
        edpp.style.display = 'block'
    })
    
    //accept change discount
    edppAccept.addEventListener("click", async() => {

        if (edppDiscount.value != 0) {
            qg.quotationData.discount = parseFloat(edppDiscount.value) / 100
            printTableQuotation(qg.elementsToQuote)
            edpp.style.display = 'none'
        }
    })

    
}
export {nqppEventListeners,cqppEventListeners}