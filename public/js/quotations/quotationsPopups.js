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

        const eventsToAdd = qg.quotations.filter(q => q.id_companies == qg.companyData.id_companies && !qg.eventsToQuote.includes(q))

        selectEvent.innerHTML = '<option value=""></option>'

        eventsToAdd.forEach(element => {
            const eventToAdd = element.event.events_courses.course_name + ' - Evento #' + String(element.id_events).padStart(8,'0')
            selectEvent.innerHTML += '<option value="' + element.id + '">' + eventToAdd + '</option>'
            
        })       
        aepp.style.display = 'block'
        
    })
    
    //aeppAccept
    aeppAccept.addEventListener("click", async() => {        

        if (selectEvent.value != '') {                        
            const eventToAdd = qg.quotations.filter(q => q.id == selectEvent.value)[0]
            qg.eventsToQuote.push(eventToAdd)
            printTableQuotation(qg.eventsToQuote)
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

            const id = qg.linesToQuote.length == 0 ? 0 : (qg.linesToQuote.reduce((max, line) => (line.id > max ? line.id : max), qg.linesToQuote)[0].id + 1)
            
            qg.linesToQuote.push({
                id:id,
                dscription:alppDescription.value,
                
            })

            console.log(qg.linesToQuote)
            
            alpp.style.display = 'none'
            
        }
        

    })
    

    
}
export {nqppEventListeners,cqppEventListeners}