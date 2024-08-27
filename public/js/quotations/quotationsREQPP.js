import { dominio } from "../dominio.js"
import { showOkPopup } from "../generalFunctions.js"
import qg from "./qGlobals.js"
import { printQuotations } from "./printCards.js"

//REFUSE QUOTATION POPUP
async function reqppEventListeners() {
    
    reqppAccept.addEventListener("click", async() => {
        
        const data = {
            idQuotation: qg.idQuotationToEdit
        }

        console.log(data)

        await fetch(dominio + 'apis/quotations/refuse-quotation',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        qg.quotations = await (await fetch(dominio + 'apis/quotations/in-progress-quotations')).json()
        qg.quotationsFiltered = qg.quotations

        //print in progress quotations
        printQuotations(qg.quotationsFiltered)

        reqpp.style.display = 'none'
        cqpp.style.display = 'none'

        showOkPopup(reqppOk)

    })
    

    
}

export {reqppEventListeners}