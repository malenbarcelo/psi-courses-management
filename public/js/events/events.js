import { dominio } from "../dominio.js"
import { printEvents, filterEvents, reserveQuotaValidations,editQuotaValidations,addStudentValidations, printStudents, uploadExcelValidations,clickAllCompanies, editEventValidations} from "./eventsFunctions.js"
import eg from "./eventsGlobals.js"
import { closePopupsEventListeners,acceptWithEnter,showOkPopup,clearInputs,isValid,uncheckInputs} from "../generalFunctions.js"

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

    eg.companies = await (await fetch(dominio + 'apis/companies')).json()

    //print events
    printEvents(eg.eventsFiltered)

    //filters event listeners
    const filters = [filterCourse,filterStartDate,filterEndDate]
    if (eg.idUserCategories == 4) {
        filters.push(filterReserved)        
    }else{
        filters.push(filterFinished,filterOnCourse,filterPending)
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
            uncheckInputs([filterFinished,filterOnCourse,filterPending])
        }
        eg.eventsFiltered = eg.events
        printEvents(eg.eventsFiltered)
    })


    //close popups
    const closePopups = [rqppClose,rqppCancel,crppClose,crppCancel,creppClose, creppCancel, stppClose,stppCancel,dsppClose,dsppCancel,ssppClose,ssppCancel,ueppClose,ueppCancel,ceppClose,ceppCancel]
    closePopupsEventListeners(closePopups)

    //reserve quota
    rqppAccept.addEventListener("click", async() => {

        let errors = 0

        if (eg.editReservationType == 'reserve') {
            errors = reserveQuotaValidations()
        }else{
            errors = editQuotaValidations()
        }

        if (errors == 0) {
            if (eg.editReservationType == 'reserve') {
                crppQuestion.innerHTML = '¿Confirma que desea reservar <b>' + rqppQuota.value + '</b> cupos para el curso <b>' + eg.eventCourseName + '</b>?'
            }else{
                crppQuestion.innerHTML = '¿Confirma que desea editar la reserva a <b>' + rqppQuota.value + '</b> cupos para el curso <b>' + eg.eventCourseName + '</b>?'
            }
            
            crpp.style.display = 'block'            
        }
    })

    acceptWithEnter(rqppQuota,rqppAccept)

    crppAccept.addEventListener("click", async() => {

        const data = {
            id_events: eg.idEvents,
            id_courses: eg.idCourses,
            id_companies: eg.idCompanies,
            reserved_quota: rqppQuota.value
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
            eg.events = await (await fetch(dominio + 'apis/courses-events/company-events/' + eg.idCompanies)).json()
        }else{
            eg.events = await (await fetch(dominio + 'apis/courses-events/events')).json()
        }
        eg.eventsFiltered = eg.events

        filterEvents()
        
        //print events
        printEvents(eg.eventsFiltered)

        crpp.style.display = 'none'
        rqpp.style.display = 'none'

        showOkPopup(rqppOk)
    })

    creppAccept.addEventListener("click", async() => {
        const data = {
            id_events: eg.idEvents,
            id_companies: eg.idCompanies
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

        crepp.style.display = 'none'

        showOkPopup(creppOk)
    })

    //nextEventsStudentsPopup
    if (stppCompany) {
        stppCompany.addEventListener("change", async() => {

            const companyEvents = await (await fetch(dominio + 'apis/courses-events/company-events/' + stppCompany.value)).json()

            const filterEvent = companyEvents.filter( e => e.id == eg.idEvents)[0]

            const reservations = stppCompany.value == '' ? filterEvent.eventReservations : filterEvent.companyReservations
            const assignations = stppCompany.value == '' ? filterEvent.eventAssignations : filterEvent.companyAssignations

            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + reservations + ' || <b>Cupos asignados: </b>' + assignations

            eg.eventStudentsFiltered = stppCompany.value == '' ? eg.eventStudents : eg.eventStudents.filter( es => es.id_companies == stppCompany.value)
            
            printStudents(eg.eventStudentsFiltered)
        })
    }

    stppAddStudent.addEventListener("click", async() => {
        
        const errors = addStudentValidations()

        if (errors == 0) {

            const inputs = [stppLastName,stppFirstName,stppEmail,stppDNI]
            const maxId = eg.eventStudents.length == 0 ? 0 : eg.eventStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventStudents[0].id);

            eg.eventStudents.push({
                id: maxId + 1,
                dni:stppDNI.value,
                email:stppEmail.value,
                first_name:stppFirstName.value,
                id_companies:eg.idCompanies,
                id_courses:eg.idCourses,
                id_events:eg.idEvents,
                last_name:stppLastName.value
            })

            printStudents(eg.eventStudents)
            clearInputs(inputs)
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length            
        }

    })

    acceptWithEnter(stppDNI,stppAddStudent)

    dsppAccept.addEventListener("click", async() => {
        eg.eventStudents = eg.eventStudents.filter(s => s.id != eg.idStudentToDelete)
        printStudents(eg.eventStudents)
        stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length
        dspp.style.display = 'none'

    })

    stppAccept.addEventListener("click", async() => {
        sspp.style.display = 'block'
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

        sspp.style.display = 'none'
        stpp.style.display = 'none'
        showOkPopup(stppOk)
    })

    uploadExcelIcon.addEventListener("click", async() => {
        uepp.style.display = 'block'
    })

    ueppDownloadTemplate.addEventListener("click", async() => {
        const fileUrl = '/files/studentsAssignation/uploadStudentsTemplate.xlsx'
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = 'uploadStudentsTemplate.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    })

    ueppAccept.addEventListener("click", async() => {

        const {data,errors} = await uploadExcelValidations()

        if (errors == 0) {

            const inputs = [stppLastName,stppFirstName,stppEmail,stppDNI]
            const maxId = eg.eventAssignedStudents.length == 0 ? 0 : eg.eventAssignedStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventAssignedStudents[0].id);

            data.forEach(element => {
                eg.eventAssignedStudents.push({
                    id: maxId + 1,
                    dni:element[3],
                    email:element[2],
                    first_name:element[1],
                    id_companies:eg.idCompanies,
                    id_courses:eg.eventCourseId,
                    id_events:eg.eventId,
                    last_name:element[0]
                })
            })

            printStudents(eg.eventAssignedStudents)
            clearInputs(inputs)
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyReservationsQty + ' || <b>Cupos asignados: </b>' + eg.eventAssignedStudents.length

            uepp.style.display = 'none'
        }

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