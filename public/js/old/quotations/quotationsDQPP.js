import { dominio } from "../dominio.js"
import qg from "./qGlobals.js"
import { printQuotations } from "./printCards.js"
import { showOkPopup } from "../generalFunctions.js"

//DELETE QUOTATION POPUP
async function dqppEventListeners() {    
    dqppAccept.addEventListener("click", async() => {
        
        console.log('hola')
        const data = {
            idQuotation: qg.idQuotationToEdit,
            elementsToCancel: qg.elementsToCancel
        }
    
        quotationsLoader.style.display = 'block'
    
        await fetch(dominio + 'apis/quotations/cancel-quotation',{
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
    
        dqpp.style.display = 'none'
        dqppOkText.innerText = 'Cotización cancelada con éxito'
    
        showOkPopup(dqppOk)       
    })
}

export {dqppEventListeners}