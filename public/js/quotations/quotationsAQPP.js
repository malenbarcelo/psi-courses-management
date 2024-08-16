import { dominio } from "../dominio.js"
import { showOkPopup } from "../generalFunctions.js"
import qg from "./qGlobals.js"
import { printQuotations } from "./printCards.js"

//ACCEPT QUOTATION POPUP
async function aqppEventListeners() {
    
    //aqppAccept
    aqppAccept.addEventListener("click", async() => {        
        
        const data = {
            idQuotation: qg.idQuotationToEdit
        }

        await fetch(dominio + 'apis/quotations/accept-quotation',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        qg.quotations = await (await fetch(dominio + 'apis/quotations/in-progress-quotations')).json()
        qg.quotationsFiltered = qg.quotations

        //print in progress quotations
        printQuotations(qg.quotationsFiltered)

        aqpp.style.display = 'none'
        cqpp.style.display = 'none'

        showOkPopup(aqppOk)

    })
    

    
}

export {aqppEventListeners}