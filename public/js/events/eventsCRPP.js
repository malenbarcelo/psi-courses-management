import { dominio } from "../dominio.js"
import { printEvents } from "./printEvents.js"
import { filterEvents} from "./filters.js"
import { completeNextEventsGlobals} from "./functions.js"
import { printCompanies} from "./printEventCompanies.js"
import { showOkPopup} from "../generalFunctions.js"
import eg from "./globals.js"


//CONFIRM RESERVATION POPUP (crpp)
async function crppEventListeners() {
    
    crppAccept.addEventListener("click", async() => {

        eg.idCompanyToEdit = eg.editReservationType == 'reserve' && eg.editReservationFrom == 'administrator' ? rqppCompany.value : eg.idCompanyToEdit

        const data = {
            id_events: eg.idEvents,
            id_courses: eg.idCourses,
            id_companies: eg.idCompanyToEdit,
            reserved_quota: rqppQuota.value,
            idQuoteToCancel: eg.idQuoteToCancel,
            idQuoteToReject: eg.idQuoteToReject
        }

        if (eg.editReservationType == 'reserve') {
            rqppOkText.innerText = 'Cupos reservados con éxito'
            await fetch(dominio + 'apis/quota-reservations/reserve-quota',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }else{
            rqppOkText.innerText = 'Reserva editada con éxito'
            await fetch(dominio + 'apis/quota-reservations/edit-reservation',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }

        //get data and complete globals
        if (eg.idUserCategories == 4 ) {
            eg.events = await (await fetch(dominio + 'apis/courses-events/company-next-events/' + eg.idCompanies)).json()
        }else{
            eg.events = await (await fetch(dominio + 'apis/courses-events/next-events')).json()
        }
        eg.eventsFiltered = eg.events

        filterEvents()        
        
        //print events
        printEvents(eg.eventsFiltered)

        //print companies if applies
        if (eg.editReservationFrom == 'administrator') {
            eg.reservationsPerEventCompany = await (await fetch(dominio + 'apis/quota-reservations/reservations-per-event-company')).json()
            let element = await (await fetch(dominio + 'apis/courses-events/next-events/')).json()
            element = element.filter(e => e.id == eg.idEvents)[0]
            completeNextEventsGlobals(element)
            printCompanies(eg.eventCompanies,element)
        }

        crpp.style.display = 'none'
        rqpp.style.display = 'none'

        showOkPopup(rqppOk)
    })
    
    
}

export {crppEventListeners}