import { dominio } from "../dominio.js"
import { editEventValidations} from "./validations.js"
import { printStudents } from "./printEventStudents.js"
import { clickAllCompanies } from "./functions.js"
import { filterEvents} from "./filters.js"
import { printEvents} from "./printEvents.js"
import { closePopupsEventListeners,acceptWithEnter,showOkPopup,clearInputs,showTableInfo,uncheckInputs} from "../generalFunctions.js"
import eg from "./globals.js"

//popups event listeners
import { cstppEventListeners} from "./eventsCSTPP.js"
import { astppEventListeners} from "./eventsASTPP.js"
import { ueppEventListeners} from "./eventsUEPP.js"
import { ssppEventListeners} from "./eventsSSPP.js"
import { deppEventListeners} from "./eventsDEPP.js"
import { rqppEventListeners} from "./eventsRQPP.js"
import { crppEventListeners} from "./eventsCRPP.js"
import { creppEventListeners} from "./eventsCREPP.js"
import { coppEventListeners} from "./eventsCOPP.js"
import { ccstppEventListeners} from "./eventsCCSTPP.js"

window.addEventListener('load',async()=>{

    eventsLoader.style.display = 'block'
    
    //get data and complete globals
    eg.idCompanies = document.getElementById('idCompany').innerText
    eg.idUserCategories = document.getElementById('idUserCategories').innerText
    if (eg.idUserCategories == 4 ) {
        eg.events = await (await fetch(dominio + 'apis/courses-events/company-events/' + eg.idCompanies)).json()
    }else{
        eg.events = await (await fetch(dominio + 'apis/courses-events/events')).json()
    }
    
    eg.eventsFiltered = eg.events
    const companies = await (await fetch(dominio + 'apis/users/companies')).json()
    eg.companies = companies.filter(c => c.company_name != 'PSI Smart Services')
    eg.reservationsPerEventCompany = await (await fetch(dominio + 'apis/quota-reservations/reservations-per-event-company')).json()
    
    //popups event listeners
    cstppEventListeners()
    astppEventListeners()
    ueppEventListeners()
    ssppEventListeners()
    deppEventListeners()
    rqppEventListeners()
    crppEventListeners()
    creppEventListeners()
    coppEventListeners()
    ccstppEventListeners()

    //print events
    printEvents(eg.eventsFiltered)

    //filters event listeners
    const filters = [filterCourse,filterMonth,filterYear,filterReserved,filterOnCourse,filterPending,filterFinished]
    
    filters.forEach(filter => {        
        filter.addEventListener("change", async() => {
            filterEvents()
            printEvents(eg.eventsFiltered)
        })
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        clearInputs([filterCourse,filterMonth,filterYear,filterReserved])
        uncheckInputs([filterOnCourse,filterPending,filterFinished])
        eg.eventsFiltered = eg.events
        printEvents(eg.eventsFiltered)
    })

    //complete year
    filterYear.value = (new Date()).getFullYear()
    filterEvents()
    printEvents(eg.eventsFiltered)

    //close popups
    let closePopups = [rqppClose,rqppCancel,crppClose,crppCancel,creppClose, creppCancel, dsppClose,dsppCancel,ssppClose,ssppCancel,ueppClose,ueppCancel,ceppClose,ceppCancel,coppClose,coppCancel,deppClose, deppCancel,ccstppClose, ccstppCancel]
    if (eg.idUserCategories == 4) {
        closePopups.push(afqppClose)
    }

    closePopupsEventListeners(closePopups)

    //table info events listeners
    let tableIcons = []
    
    if (eg.idUserCategories == 4) {
        tableIcons = [
            {
                icon:rqppIcon,
                right:'13%'
            },
            {
                icon:erpp2Icon,
                right:'10%'
            },
            {
                icon:crpp2Icon,
                right:'7%'
            },
            {
                icon:stppIcon,
                right:'3.5%'
            }
        ]
    }else{
        tableIcons = [
            {
                icon:ceppIcon,
                right:'13%'
            },
            {
                icon:deppIcon,
                right:'10%'
            },
            {
                icon:coppIcon,
                right:'7%'
            },
            {
                icon:stppIcon,
                right:'3.5%'
            },
        ]
    }

    showTableInfo(tableIcons,280,150)

    //download data
    download.addEventListener("click", async() => {

        const data = eg.eventsFiltered

        const response = await fetch('/apis/events/download-events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'eventos.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
        } else {
            console.error('Error al descargar el archivo')
        }
    })

    //ask for quota 
    const askForQuotaBtn = document.getElementById('askForQuotaBtn')
    if (askForQuotaBtn) {
        askForQuotaBtn.addEventListener("click", async() => {
            afqpp.style.display = 'block'
        })
    }
    


    dsppAccept.addEventListener("click", async() => {
        eg.eventStudents = eg.eventStudents.filter(s => s.id != eg.idStudentToDelete)
        eg.eventStudentsFiltered = eg.eventStudentsFiltered.filter(s => s.id != eg.idStudentToDelete)
        let loader
        let body
        let subtitle
        
        if (eg.idUserCategories == 4) {
            loader = document.getElementById('cstppLoader')
            body = document.getElementById('cstppBody')
            subtitle = document.getElementById('cstppSubtitle2')
            printStudents(eg.eventStudents,loader,body)
        }else{
            loader = document.getElementById('astppLoader')
            body = document.getElementById('astppBody')
            subtitle = document.getElementById('astppSubtitle2')
            printStudents(eg.eventStudentsFiltered,loader,body)
        }
        
        

        const reservations = eg.idUserCategories == 4 ? eg.companyEventData.companyReservations : eg.eventData.eventReservations
        
        subtitle.innerHTML = '<b>Cupos reservados:</b> ' + reservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length
        
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

            if (eg.companies.length == eg.eventInvitedCompanies.length) {
                ceppAllCompanies.checked = true
            }else{
                ceppAllCompanies.checked = false
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
                eg.events = await (await fetch(dominio + 'apis/courses-events/company-events/' + eg.idCompanies)).json()
            }else{
                eg.events = await (await fetch(dominio + 'apis/courses-events/events')).json()
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