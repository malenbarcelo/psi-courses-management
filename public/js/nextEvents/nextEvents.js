import { dominio } from "../dominio.js"
import { printEvents, filterEvents, reserveQuotaValidations,editQuotaValidations,addStudentValidations, printStudents} from "./nextEventsFunctions.js"
import neg from "./nextEventsGlobals.js"
import { closePopupsEventListeners,acceptWithEnter,showOkPopup,clearInputs,isValid} from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    eventsLoader.style.display = 'block'
    
    //get data and complete globals
    neg.idCompany = document.getElementById('idCompany').innerText
    neg.companyEvents = await (await fetch(dominio + 'apis/courses/company-next-events/' + neg.idCompany)).json()
    neg.companyEventsFiltered = neg.companyEvents
    neg.companyReservations = await (await fetch(dominio + 'apis/company-reservations/' + neg.idCompany)).json()
    neg.companyAssignedStudents = await (await fetch(dominio + 'apis/company-assigned-students/' + neg.idCompany)).json()
    
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
    const closePopups = [rqppClose,rqppCancel,crppClose,crppCancel,creppClose, creppCancel, stppClose,stppCancel,dsppClose,dsppCancel,ssppClose,ssppCancel]
    closePopupsEventListeners(closePopups)

    //reserve quota
    rqppAccept.addEventListener("click", async() => {

        let errors = 0

        if (neg.editReservationType == 'reserve') {
            errors = reserveQuotaValidations()
        }else{
            errors = editQuotaValidations()
        }

        if (errors == 0) {
            if (neg.editReservationType == 'reserve') {
                crppQuestion.innerHTML = '¿Confirma que desea reservar <b>' + rqppQuota.value + '</b> cupos para el curso <b>' + neg.eventCourseName + '</b>?'
            }else{
                crppQuestion.innerHTML = '¿Confirma que desea editar la reserva a <b>' + rqppQuota.value + '</b> cupos para el curso <b>' + neg.eventCourseName + '</b>?'
            }
            
            crpp.style.display = 'block'            
        }
    })

    acceptWithEnter(rqppQuota,rqppAccept)

    crppAccept.addEventListener("click", async() => {

        const data = {
            id_events: neg.eventId,
            id_courses: neg.eventCourseId,
            id_companies: parseInt(neg.idCompany),
            reserved_quota: parseInt(rqppQuota.value)
        }

        if (neg.editReservationType == 'reserve') {
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
        neg.companyEvents = await (await fetch(dominio + 'apis/courses/company-next-events/' + neg.idCompany)).json()
        neg.companyReservations = await (await fetch(dominio + 'apis/company-reservations/' + neg.idCompany)).json()
        neg.companyEventsFiltered = neg.companyEvents

        filterEvents()
        
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

    //nextEventsStudentsPopup
    stppAddStudent.addEventListener("click", async() => {
        
        const errors = addStudentValidations()

        if (errors == 0) {

            const inputs = [stppLastName,stppFirstName,stppEmail,stppDNI]
            const maxId = neg.eventAssignedStudents.length == 0 ? 0 : neg.eventAssignedStudents.reduce((max, st) => (st.id > max ? st.id : max), neg.eventAssignedStudents[0].id);

            neg.eventAssignedStudents.push({
                id: maxId + 1,
                dni:stppDNI.value,
                email:stppEmail.value,
                first_name:stppFirstName.value,
                id_companies:neg.idCompany,
                id_courses:neg.eventCourseId,
                id_events:neg.eventId,
                last_name:stppLastName.value
            })

            printStudents(neg.eventAssignedStudents)
            clearInputs(inputs)
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + neg.companyReservationsQty + ' || <b>Cupos asignados: </b>' + neg.eventAssignedStudents.length
            
        }

    })

    dsppAccept.addEventListener("click", async() => {
        neg.eventAssignedStudents = neg.eventAssignedStudents.filter(s => s.id != neg.idStudentToDelete)
        printStudents(neg.eventAssignedStudents)
        stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + neg.companyReservationsQty + ' || <b>Cupos asignados: </b>' + neg.eventAssignedStudents.length
        dspp.style.display = 'none'

    })

    stppAccept.addEventListener("click", async() => {
        sspp.style.display = 'block'
    })

    ssppAccept.addEventListener("click", async() => {

        const data = {
            id_events: neg.eventId,
            id_companies: neg.idCompany,
            students:neg.eventAssignedStudents
        }

        await fetch(dominio + 'apis/update-assigned-students/',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        printStudents(neg.eventAssignedStudents)
        stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + neg.companyReservationsQty + ' || <b>Cupos asignados: </b>' + neg.eventAssignedStudents.length
        sspp.style.display = 'none'
        stpp.style.display = 'none'
        showOkPopup(stppOk)
        



    })



})