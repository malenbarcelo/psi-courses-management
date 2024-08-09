import { dominio } from "../dominio.js"
import qg from "./qGlobals.js"
import { printTableQuotation } from "./printTables.js"

//ADD LINE POPUP
async function alppEventListeners() {
    
    alppAccept.addEventListener("click", async() => {        

        if (alppDescription.value != '') {

            const maxId = qg.elementsToQuote.length == 0 ? 0 : qg.elementsToQuote.reduce((max, obj) => (obj.id > max ? obj.id : max), qg.elementsToQuote[0].id)
            
            qg.elementsToQuote.push({
                id:maxId + 1,
                description: alppDescription.value,
                unit_price:null,
                quantity:null,
                subtotal:null,
                discount:0,
                total:null,
                data:[]
            })

            printTableQuotation(qg.elementsToQuote)
            
            alpp.style.display = 'none'            
        }
    })
}



export {alppEventListeners}