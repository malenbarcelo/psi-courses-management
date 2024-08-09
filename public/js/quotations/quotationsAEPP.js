import qg from "./qGlobals.js"
import { printTableQuotation } from "./printTables.js"

//ADD EVENT POPUP
async function aeppEventListeners() {
    
    aeppAccept.addEventListener("click", async() => {        

        if (aeppEvent.value != '') {                        
            
            const eventToAdd = qg.quotations.filter(q => q.id == aeppEvent.value)[0]

            const maxId = qg.elementsToQuote.length == 0 ? 0 : qg.elementsToQuote.reduce((max, obj) => (obj.id > max ? obj.id : max), qg.elementsToQuote[0].id)
            
            qg.elementsToQuote.push({
                id:maxId + 1,
                description: eventToAdd.event.events_courses.course_name + ' - Evento #' + String(eventToAdd.id_events).padStart(8,'0'),
                unit_price:null,
                quantity:parseInt(qg.reservationsPerCompany.filter(r => r.id_events == eventToAdd.id_events && r.id_companies == eventToAdd.id_companies)[0].total_quota_reservations),
                subtotal:null,
                discount:0,
                total:null,
                data:eventToAdd
            })

            printTableQuotation(qg.elementsToQuote)
            aepp.style.display = 'none'
            
        }
    })    
}

export {aeppEventListeners}