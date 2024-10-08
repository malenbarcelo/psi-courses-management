import { dominio } from "../dominio.js"
import { printEvents } from "./printEvents.js"
import { filterEvents } from "./filters.js"
import eg from "./globals.js"
import { showOkPopup} from "../generalFunctions.js"

//SAVE STUDENTS POPUP (sspp)
async function ssppEventListeners() {

    const closeInputs = [ssppClose,ssppCancel]
    closeInputs.forEach(input => {
        input.addEventListener("click", async() => {
            const acceptAdm = document.getElementById('astppAcceptConditions')
            const acceptCust = document.getElementById('cstppAcceptConditions')
            if (acceptAdm) {
                acceptAdm.checked = false                
            }else{
                acceptCust.checked = false
            }
        })
    })
    
    ssppAccept.addEventListener("click", async() => {
        
        const data = {
            id_events: eg.idEvents,
            id_companies: eg.idCompanies,
            students:eg.eventStudents
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
        cstpp.style.display = 'none'
        astpp.style.display = 'none'

        showOkPopup(cstppOk)
    })
}

export {ssppEventListeners}