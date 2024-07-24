import { dominio } from "../dominio.js"
import { printEvents, filterEvents, reserveQuotaValidations,editQuotaValidations,addStudentValidations, printStudents, uploadExcelValidations} from "./eventsFunctions.js"
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
    const closePopups = [rqppClose,rqppCancel,crppClose,crppCancel,creppClose, creppCancel, stppClose,stppCancel,dsppClose,dsppCancel,ssppClose,ssppCancel,ueppClose,ueppCancel]
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
            id_events: eg.eventId,
            id_courses: eg.eventCourseId,
            id_companies: parseInt(eg.idCompanies),
            reserved_quota: parseInt(rqppQuota.value)
        }

        if (eg.editReservationType == 'reserve') {
            rqppOkText.innerText = 'Cupos reservados con éxito'
            await fetch(dominio + 'apis/courses/next-events/reserve-quota',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }else{
            rqppOkText.innerText = 'Reserva editada con éxito'
            await fetch(dominio + 'apis/courses/next-events/edit-reservation',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }

        //get data and complete globals
        eg.companyEvents = await (await fetch(dominio + 'apis/courses/company-next-events/' + eg.idCompanies)).json()
        eg.companyReservations = await (await fetch(dominio + 'apis/company-reservations/' + eg.idCompanies)).json()
        eg.companyEventsFiltered = eg.companyEvents

        filterEvents()
        
        //print events
        printEvents(eg.companyEventsFiltered)

        crpp.style.display = 'none'
        rqpp.style.display = 'none'

        showOkPopup(rqppOk)
    })

    creppAccept.addEventListener("click", async() => {
        const data = {
            id_events: eg.eventId,
            id_companies: eg.idCompanies
        }

        await fetch(dominio + 'apis/courses/next-events/cancel-reservation',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get data and complete globals
        eg.companyEvents = await (await fetch(dominio + 'apis/courses/company-next-events/' + eg.idCompanies)).json()
        eg.companyEventsFiltered = eg.companyEvents
        eg.companyEventsFiltered = eg.companyEvents
        eg.companyReservations = await (await fetch(dominio + 'apis/company-reservations/' + eg.idCompanies)).json()
        eg.companyAssignedStudents = await (await fetch(dominio + 'apis/company-assigned-students/' + eg.idCompanies)).json()

        //filter
        filterEvents()
        
        //print events
        printEvents(eg.companyEventsFiltered)

        crepp.style.display = 'none'

        showOkPopup(creppOk)
    })

    //nextEventsStudentsPopup
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
                id_events:neg.idEvents,
                last_name:stppLastName.value
            })

            printStudents(neg.eventStudents)
            clearInputs(inputs)
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + neg.companyReservations + ' || <b>Cupos asignados: </b>' + neg.eventStudents.length            
        }

    })

    acceptWithEnter(stppDNI,stppAddStudent)

    dsppAccept.addEventListener("click", async() => {
        neg.eventStudents = neg.eventStudents.filter(s => s.id != neg.idStudentToDelete)
        printStudents(neg.eventStudents)
        stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + neg.companyReservations + ' || <b>Cupos asignados: </b>' + neg.eventStudents.length
        dspp.style.display = 'none'

    })

    stppAccept.addEventListener("click", async() => {
        sspp.style.display = 'block'
    })

    ssppAccept.addEventListener("click", async() => {
        const data = {
            id_events: neg.idEvents,
            id_companies: neg.idCompanies,
            students:neg.eventStudents
        }

        await fetch(dominio + 'apis/update-assigned-students/',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //update data
        if (neg.idUserCategories == 4 ) {
            neg.events = await (await fetch(dominio + 'apis/courses-events/company-events/' + neg.idCompanies)).json()
        }else{
            neg.events = await (await fetch(dominio + 'apis/courses-events/events')).json()
        }
    
        neg.eventsFiltered = neg.events
        
        //filter
        filterEvents()

        //print events
        printEvents(neg.eventsFiltered)

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
            const maxId = neg.eventAssignedStudents.length == 0 ? 0 : neg.eventAssignedStudents.reduce((max, st) => (st.id > max ? st.id : max), neg.eventAssignedStudents[0].id);

            data.forEach(element => {
                neg.eventAssignedStudents.push({
                    id: maxId + 1,
                    dni:element[3],
                    email:element[2],
                    first_name:element[1],
                    id_companies:neg.idCompanies,
                    id_courses:neg.eventCourseId,
                    id_events:neg.eventId,
                    last_name:element[0]
                })
            })

            printStudents(neg.eventAssignedStudents)
            clearInputs(inputs)
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + neg.companyReservationsQty + ' || <b>Cupos asignados: </b>' + neg.eventAssignedStudents.length

            uepp.style.display = 'none'
        }

    })



    





})