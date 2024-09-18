import { dominio } from "../dominio.js"
import { printEvents } from "./printEvents.js"
import { filterEvents} from "./filters.js"

import eg from "./globals.js"
import { showOkPopup} from "../generalFunctions.js"

//DELETE EVENT POPUP (depp)
async function deppEventListeners() {
    
    deppAccept.addEventListener("click", async() => {
        
        const data = {
            id_events: eg.idEvents
        }

        await fetch(dominio + 'apis/events/delete-event/',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //update data
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

        depp.style.display = 'none'
        showOkPopup(deppOk)
    })
}

export {deppEventListeners}