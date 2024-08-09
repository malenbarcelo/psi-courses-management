import qg from "./qGlobals.js"
import { printTableQuotation } from "./printTables.js"

//EDIT DISCOUNT POPUP
async function edppEventListeners() {
    
    //accept change discount  (create quotation popup)
    edppAccept.addEventListener("click", async() => {

        if (edppDiscount.value != '') {
            qg.quotationData.discount = parseFloat(edppDiscount.value) / 100
            printTableQuotation(qg.elementsToQuote)
            edpp.style.display = 'none'
        }
    })
}

export {edppEventListeners}