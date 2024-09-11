import { dominio } from "../dominio.js"
import { printEvents } from "./printEvents.js"
import { printCompanies } from "./printEventCompanies.js"
import { filterEvents} from "./filters.js"
import { showOkPopup} from "../generalFunctions.js"
import { completeNextEventsGlobals} from "./functions.js"
import eg from "./globals.js"


//CANCEL RESERVATION POPUP (crrpp)
async function creppEventListeners() {

    creppAccept.addEventListener("click", async() => {
        const data = {
            id_events: eg.idEvents,
            id_companies: eg.idCompanyToEdit,
            idQuoteToCancel: eg.idQuoteToCancel,
            idQuoteToReject: eg.idQuoteToReject
        }

        await fetch(dominio + 'apis/quota-reservations/cancel-reservation',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get data and complete globals
        if (eg.idUserCategories == 4 ) {
            eg.events = await (await fetch(dominio + 'apis/courses-events/company-events/' + eg.idCompanies)).json()
        }else{
            eg.events = await (await fetch(dominio + 'apis/courses-events/events')).json()
        }
        eg.eventsFiltered = eg.events

        //filter
        filterEvents()
        
        //print events
        printEvents(eg.eventsFiltered)

        //print companies if applies
        if (eg.editReservationFrom == 'administrator') {
            eg.reservationsPerEventCompany = await (await fetch(dominio + 'apis/quota-reservations/reservations-per-event-company')).json()
            eg.eventCompanies = [...new Set(eg.reservationsPerEventCompany.map(rpc => rpc.id_companies))]
            console.log(eg.eventCompanies)
            printCompanies(eg.eventCompanies)
        }

        crepp.style.display = 'none'

        showOkPopup(creppOk)
    })
    
   
    
    
}

export {creppEventListeners}