import { dominio } from "../dominio.js"
import qg from "./qGlobals.js"
import { printQuotations } from "./printCards.js"
import { showOkPopup } from "../generalFunctions.js"
import { saveQuotation } from "./functions.js"

//SEND QUOTATION POPUP
async function sqppEventListeners() {    
    sqppAccept.addEventListener("click", async() => {        
        saveQuotation('send',sqpp)        
    })
}

export {sqppEventListeners}