import { dominio } from "../dominio.js"
import { showOkPopup } from "../generalFunctions.js"
import qg from "./qGlobals.js"
import { printQuotations } from "./printCards.js"

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

export {nqppEventListeners}