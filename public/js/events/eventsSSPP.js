import { dominio } from "../dominio.js"
import { printEvents } from "./printEvents.js"
import { filterEvents } from "./filters.js"
import eg from "./globals.js"
import { showOkPopup} from "../generalFunctions.js"

//SAVE STUDENTS POPUP (sspp)
async function ssppEventListeners() {
    
    ssppAccept.addEventListener("click", async() => {
        const data = {
            id_events: eg.idEvents,
            id_companies: eg.idCompanies,
            students:eg.eventStudents,
            studentsFrom:eg.studentsFrom
        }

        await fetch(dominio + 'apis/update-assigned-students/',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

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

        sspp.style.display = 'none'
        stpp.style.display = 'none'
        showOkPopup(stppOk)
    })
}

export {ssppEventListeners}