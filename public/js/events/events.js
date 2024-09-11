import { dominio } from "../dominio.js"
import { editEventValidations} from "./validations.js"
import { printStudents } from "./printEventStudents.js"
import { clickAllCompanies } from "./functions.js"
import { filterEvents} from "./filters.js"
import { printEvents} from "./printEvents.js"
import { closePopupsEventListeners,acceptWithEnter,showOkPopup,clearInputs,showTableInfo,uncheckInputs} from "../generalFunctions.js"
import eg from "./globals.js"

//popups event listeners
import { stppEventListeners} from "./eventsSTPP.js"
import { ueppEventListeners} from "./eventsUEPP.js"
import { ssppEventListeners} from "./eventsSSPP.js"
import { deppEventListeners} from "./eventsDEPP.js"
import { rqppEventListeners} from "./eventsRQPP.js"
import { crppEventListeners} from "./eventsCRPP.js"
import { creppEventListeners} from "./eventsCREPP.js"

window.addEventListener('load',async()=>{

    eventsLoader.style.display = 'block'
    
    //get data and complete globals
    eg.idCompanies = document.getElementById('idCompany').innerText
    eg.idUserCategories = document.getElementById('idUserCategories').innerText
    if (eg.idUserCategories == 4 ) {
        eg.events = await (await fetch(dominio + 'apis/courses-events/company-next-events/' + eg.idCompanies)).json()
    }else{
        eg.events = await (await fetch(dominio + 'apis/courses-events/next-events')).json()
    }    
    eg.eventsFiltered = eg.events
    const companies = await (await fetch(dominio + 'apis/users/companies')).json()
    eg.companies = companies.filter(c => c.company_name != 'PSI Smart Services')
    eg.reservationsPerEventCompany = await (await fetch(dominio + 'apis/quota-reservations/reservations-per-event-company')).json()
    
    //popups event listeners
    stppEventListeners()
    ueppEventListeners()
    ssppEventListeners()
    deppEventListeners()
    rqppEventListeners()
    crppEventListeners()
    creppEventListeners()      
    
    //print events
    printEvents(eg.eventsFiltered)

    //filters event listeners
    const filters = [filterCourse,filterStartDate,filterEndDate]
    if (eg.idUserCategories == 4) {
        filters.push(filterReserved)        
    }else{
        filters.push(filterOnCourse,filterPending)
    }

    filters.forEach(filter => {        
        filter.addEventListener("change", async() => {
            filterEvents()
            printEvents(eg.eventsFiltered)
        })
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        clearInputs([filterCourse,filterStartDate,filterEndDate])
        if (eg.idUserCategories == 4) {
            uncheckInputs([filterReserved])
        }else{
            uncheckInputs([filterOnCourse,filterPending])
        }
        eg.eventsFiltered = eg.events
        printEvents(eg.eventsFiltered)
    })


    //close popups
    const closePopups = [rqppClose,rqppCancel,crppClose,crppCancel,creppClose, creppCancel, stppClose,stppCancel,dsppClose,dsppCancel,ssppClose,ssppCancel,ueppClose,ueppCancel,ceppClose,ceppCancel,coppClose,coppCancel,deppClose, deppCancel]
    closePopupsEventListeners(closePopups)

    //table info events listeners
    const tableIcons = [
        {
            icon:erppIcon,
            right:'7.5%'
        },
        {
            icon:crppIcon,
            right:'1.5%'
        }
    ]

    showTableInfo(tableIcons,130,150)

    dsppAccept.addEventListener("click", async() => {
        eg.eventStudents = eg.eventStudents.filter(s => s.id != eg.idStudentToDelete)
        printStudents(eg.eventStudents)
        const reservations = eg.studentsFrom == 'customer' ? eg.companyReservations : eg.eventData.eventReservations
        stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + reservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length
        dspp.style.display = 'none'

    })

    //edit event
    ceppAllCompanies.addEventListener("click", async() => {
        eg.eventInvitedCompanies = []
        clickAllCompanies()
    })

    eg.companies.forEach(company => {
        const checkCompany = document.getElementById('ceppCompany_' + company.id)
        checkCompany.addEventListener("click", async() => {
            if (checkCompany.checked) {
                eg.eventInvitedCompanies.push(company.id)                
            }else{
                eg.eventInvitedCompanies = eg.eventInvitedCompanies.filter(c => c != company.id)
            }
        })
    })

    ceppAccept.addEventListener("click", async() => {

        const errors = editEventValidations()

        if (errors == 0) {
            
            const data = {
                id_courses:eg.idCourses,
                invited_companies:eg.eventInvitedCompanies,
                start_date:new Date(ceppStartDate.value + 'T03:00:00Z'),//to get argentina time
                end_date:new Date(ceppEndDate.value + 'T03:00:00Z'),//to get argentina time
                start_time:ceppStartTime.value,
                end_time:ceppEndTime.value,
                event_quota:ceppEventQuota.value,
                id_events:eg.idEvents
            }

            await fetch(dominio + 'apis/courses-events/edit-event',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get data and complete globals
            if (eg.idUserCategories == 4 ) {
                eg.events = await (await fetch(dominio + 'apis/courses-events/company-next-events/' + eg.idCompanies)).json()
            }else{
                eg.events = await (await fetch(dominio + 'apis/courses-events/next-events')).json()
            }
            eg.eventsFiltered = eg.events

            //filter
            filterEvents()
            
            //print events
            printEvents(eg.eventsFiltered)

            cepp.style.display = 'none'
            ceppOkText.innerText = 'Evento editado con éxito'
            showOkPopup(ceppOk)
        
        }

    })

})