import { dominio } from "../dominio.js"
import qg from "./qGlobals.js"
import { printTableQuotation } from "./printTables.js"

//ADD LINE POPUP
async function alppEventListeners() {
    
    alppAccept.addEventListener("click", async() => {        

        if (alppDescription.value != '') {

            qg.elementsToQuote.push({
                id:-1,
                id_events:null,
                description: alppDescription.value,
                unit_price:null,
                quantity:null,
                subtotal:null,
                discount:0,
                total:null,                
                discount:0,
                total:null,
                id_companies:qg.companyData.id,
                companyData:qg.companyData,
                eventData:{},
                type:2
            })

            printTableQuotation(qg.elementsToQuote)
            
            alpp.style.display = 'none'            
        }
    })
}



export {alppEventListeners}