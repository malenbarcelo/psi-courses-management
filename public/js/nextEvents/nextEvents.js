import { dominio } from "../dominio.js"
import { printEvents, filterEvents, reserveQuotaValidations} from "./nextEventsFunctions.js"
import neg from "./nextEventsGlobals.js"
import { closePopupsEventListeners,acceptWithEnter,showOkPopup,clearInputs,isValid} from "../generalFunctions.js"

window.addEventListener('load',async()=>{
    
    //get data and complete globals
    neg.idCompany = document.getElementById('idCompany').innerText
    neg.companyEvents = await (await fetch(dominio + 'apis/courses/company-next-events/' + neg.idCompany)).json()
    neg.companyEventsFiltered = neg.companyEvents
    
    //print events
    printEvents(neg.companyEventsFiltered)

    //filters event listeners
    const filters = [filterCourse,filterReserved]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterEvents()
            printEvents(neg.companyEventsFiltered)
        })
    })

    //close popups
    const closePopups = [rqppClose,rqppCancel,crppClose,crppCancel,creppClose, creppCancel]
    closePopupsEventListeners(closePopups)

    //reserve quota
    rqppAccept.addEventListener("click", async() => {
        
        const errors = reserveQuotaValidations()

        if (errors == 0) {
            crppQuestion.innerHTML = '¿Confirma que desea reservar <b>' + rqppQuota.value + '</b> cupos para el curso <b>' + neg.eventCourseName + '</b>?'
            crpp.style.display = 'block'            
        }
    })

    acceptWithEnter(rqppQuota,rqppAccept)

    crppAccept.addEventListener("click", async() => {
        const data = {
            id_events: neg.eventId,
            id_courses: neg.eventCourseId,
            id_companies: neg.idCompany,
            reserved_quota: rqppQuota.value
        }

        await fetch(dominio + 'apis/courses/next-events/reserve-quota',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get data and complete globals
        neg.companyEvents = await (await fetch(dominio + 'apis/courses/company-next-events/' + neg.idCompany)).json()
        neg.companyEventsFiltered = neg.companyEvents
        
        //print events
        printEvents(neg.companyEventsFiltered)

        crpp.style.display = 'none'
        rqpp.style.display = 'none'

        showOkPopup(rqppOk)
    })

    creppAccept.addEventListener("click", async() => {
        const data = {
            id_events: neg.eventId,
            id_companies: neg.idCompany
        }

        await fetch(dominio + 'apis/courses/next-events/cancel-reservation',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get data and complete globals
        neg.companyEvents = await (await fetch(dominio + 'apis/courses/company-next-events/' + neg.idCompany)).json()
        neg.companyEventsFiltered = neg.companyEvents
        
        //print events
        printEvents(neg.companyEventsFiltered)

        crepp.style.display = 'none'

        showOkPopup(creppOk)
    })


})