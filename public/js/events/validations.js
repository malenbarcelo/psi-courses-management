import { dominio } from "../dominio.js"
import eg from "./globals.js"
import {isValid, isInvalid, inputsValidation } from "../generalFunctions.js"

function reserveQuotaValidations() {
    console.log(rqppCompany.value)

    let errors = 0

    //quota
    if (rqppCompany.value == '' && eg.editReservationFrom == 'administrator') {
        rqppCompanyError.innerText = 'Debe seleccionar una empresa'
        isInvalid([rqppCompany])
        rqppQuotaError.style.display = 'block'
        errors +=1
    }else{
        isValid([rqppCompany])
    }

    if (rqppQuota.value == '' || rqppQuota.value <= 0) {
        rqppQuotaError.innerText = 'El cupo debe ser un número mayor a 0'
        isInvalid([rqppQuota])
        rqppQuotaError.style.display = 'block'
        errors +=1
    }

    if (errors == 0) {
        if (rqppQuota.value > eg.eventData.event_quota - eg.eventData.eventReservations) {
            rqppQuotaError.innerText = 'Se puede reservar una cantidad máxima de ' + (eg.eventData.event_quota - eg.eventData.eventReservations) + ' cupos'
            isInvalid([rqppQuota])
            rqppQuotaError.style.display = 'block'
            errors +=1
        }else{
            isValid([rqppQuota])
            rqppQuotaError.style.display = 'none'
        }
    }

    return errors
}

function editQuotaValidations() {

    let errors = 0

    //quota
    if (rqppQuota.value == '' || rqppQuota.value <= 0) {
        rqppQuotaError.innerText = 'El cupo debe ser un número mayor a 0'
        isInvalid([rqppQuota])
        rqppQuotaError.style.display = 'block'
        errors +=1
    }else{
        if (rqppQuota.value > (eg.companyEventData.event_quota - eg.companyEventData.eventReservations + eg.companyEventData.companyReservations)) {
            rqppQuotaError.innerText = 'Se puede reservar una cantidad máxima de ' + (eg.companyEventData.event_quota - eg.companyEventData.eventReservations + eg.companyEventData.companyReservations) + ' cupos'
            isInvalid([rqppQuota])
            rqppQuotaError.style.display = 'block'
            errors +=1
        }else{
            if(eg.editReservationType == 'edit' && eg.companyEventData.events_students.length > rqppQuota.value){
                rqppQuotaError.innerText = 'La reserva no puede ser inferior a la cantidad de alumnos asignados (' + eg.companyEventData.events_students.length + ' alumnos).'
                isInvalid([rqppQuota])
                rqppQuotaError.style.display = 'block'
                errors +=1
            }else{
                isValid([rqppQuota])
                rqppQuotaError.style.display = 'none'
            }
            
        }
    }
    return errors
}

async function uploadExcelValidations() {

    console.log(eg.eventStudents)

    let errors = 0
    let data = []

    const file = ueppFile.files[0]

    if (!file) {
        errors += 1
        isInvalid([ueppDivInput])
        ueppFileError.innerText = 'Debe seleccionar un archivo'
        ueppFileError.style.display = 'block'        
    }else{

        const fileName = file.name;
        const fileExtension = fileName.split('.').pop()

        if (fileExtension != 'xlsx' && fileExtension != 'xls') {
            errors +=1
            ueppFileError.innerText = 'Las extensiones permitidas son ".xlsx" y ".xls"'
        }else{
            const formData = new FormData()
            formData.append('ueppFile', ueppFile.files[0])

            const response = await fetch('/apis/events-students/read-excel-file', {
                method: 'POST',
                body: formData
                })

            data = await response.json()
            data.shift()

            if (eg.companyReservations < (eg.eventStudents.length + data.length)) {
                errors += 1
                ueppFileError.innerText = 'Supera la cantidad de cupos reservados'                
            }

            if (errors == 0) {
                data.forEach(row => {
                    if (row.includes(null) || row.includes('')) {
                        errors +=1
                        ueppFileError.innerText = 'Se detectaron campos vacíos en el archivo'
                    }
                })
            }

            if (errors == 0) {
                const dnis = data.map(subArray => parseInt(subArray[2]))
                const uniqueDnis = [...new Set(dnis)]

                if (dnis.length != uniqueDnis.length) {
                    errors +=1
                    ueppFileError.innerText = 'Se detectaron DNIs duplicados en el archivo'
                }else{

                    const assignedDnis = eg.eventStudents.length == 0 ? [] : eg.eventStudents.map(students => parseInt(students.dni))
                    
                    const set1 = new Set(dnis)
                    const set2 = new Set(assignedDnis)
                    
                    console.log(set1)
                    console.log(set2)

                    const repeatedDnis = [...set1].filter(dni => set2.has(dni))

                    console.log(repeatedDnis)

                    if (repeatedDnis.length > 0) {
                        errors +=1
                        ueppFileError.innerText = 'Se detectaron DNIs ya asignados en el archivo'
                    }
                }
            }

            if (errors == 0) {
                data.forEach(row => {
                    if (row[4] != 'si') {
                        errors +=1
                        ueppFileError.innerText = 'Todos los alumnos deben tener el apto médico vigente'
                    }
                })
            }
        }
    }

    if (errors > 0) {
        isInvalid([ueppDivInput])
        ueppFile.value=''
        ueppFileError.style.display = 'block'
    }

    return {data,errors}
}

async function addStudentValidations() {

    let inputs = [cstppLastName,cstppFirstName,cstppDNI,cstppART]

    if (eg.studentsFrom == 'administrator') {
        inputs.push(cstppCompany)
    }
    
    let errors = inputsValidation(inputs)

    if (errors == 0) {
        const findDNI  = eg.eventStudents.filter(s => s.dni == cstppDNI.value)
        if (findDNI.length > 0 ) {
            errors += 1
            cstppError.innerText = 'Ya existe en la lista un alumno con el DNI ' + cstppDNI.value
            isInvalid([cstppDNI])
        }else{
            const cstppMedicalCert = document.getElementById('cstppMedicalCert')
            if (cstppMedicalCert && !cstppMedicalCert.checked) {
                errors += 1
                cstppError.innerText = 'El alumno debe poseer el apto médico vigente'
                isInvalid([cstppCheckbox])
            }else{
                const company = document.getElementById('cstppCompany')
                
                if (company) {
                    const companyEventsData = await (await fetch(dominio + 'apis/courses-events/company-events/' + company.value)).json()
                    const companyEventData = companyEventsData.filter(ced => ced.id == eg.idEvents)
                    eg.companyReservations = companyEventData[0].companyReservations
                }

                if (eg.companyReservations == eg.eventStudents.length) {
                    console.log(eg.companyReservations)
                    console.log(eg.eventStudents)

                    errors += 1
                    cstppError.innerText = 'Supera la cantidad de cupos reservados'                
                }else{
                    const cstppCheckbox = document.getElementById('cstppCheckbox')
                    isValid([cstppDNI,cstppCheckbox])
                    cstppError.style.display = 'none'
                }
            }
        }
    }else{
        cstppError.innerText = 'Debe complear todos los datos'
    }

    if (errors > 0) {
        cstppError.style.display = 'block'
    }

    return errors
}

function editEventValidations() {

    let errors = 0

    //date
    if (ceppStartDate.value == '' || ceppEndDate.value == '') {
        ceppDateError.innerText = 'Debe completar las fechas de inicio y fin'
        isInvalid([ceppStartDate,ceppEndDate])
        ceppDateError.style.display = 'block'
        errors +=1
    }else{
        if (ceppStartDate.value > ceppEndDate.value) {
            ceppDateError.innerText = 'La fecha de fin no puede ser inferior a la fecha de inicio'
            isInvalid([ceppStartDate,ceppEndDate])
            ceppDateError.style.display = 'block'
            errors +=1
        }else{
            isValid([ceppStartDate,ceppEndDate])
            ceppDateError.style.display = 'none'
        }
    }

    //time    
    if (ceppStartTime.value == '' || ceppEndTime.value == '') {
        ceppTimeError.innerText = 'Debe completar los horarios de inicio y fin'
        isInvalid([ceppStartTime,ceppEndTime])
        ceppTimeError.style.display = 'block'
        errors +=1
    }else{
        if (ceppStartTime.value > ceppEndTime.value) {
            ceppTimeError.innerText = 'El horario de inicio no puede ser inferior al horario de fin'
            isInvalid([ceppStartTime,ceppEndTime])
            ceppTimeError.style.display = 'block'
            errors +=1
        }else{
            isValid([ceppStartTime,ceppEndTime])
            ceppTimeError.style.display = 'none'
        }
    }

    //quota
    if (ceppEventQuota.value == '') {
        ceppEventQuotaError.innerText = 'Debe completar el cupo'
        isInvalid([ceppEventQuota])
        ceppEventQuotaError.style.display = 'block'
        errors +=1
    }else{      
        if (ceppEventQuota.value < eg.eventData.eventReservations) {
            ceppEventQuotaError.innerText = 'El cupo no puede ser inferior a las reservas del evento'
            isInvalid([ceppEventQuota])
            ceppEventQuotaError.style.display = 'block'
            errors +=1
        }else{
            isValid([ceppEventQuota])
            ceppEventQuotaError.style.display = 'none'
        }
    }

    //companies
    if (eg.eventInvitedCompanies.length == 0) {
        ceppCompaniesError.innerText = 'Debe seleccionar al menos una empresa'
        ceppCompaniesError.style.display = 'block'
        errors +=1
    }else{
        
        if (eg.eventCompanies.some(item => !eg.eventInvitedCompanies.includes(item))) {
            ceppCompaniesError.innerText = 'No se puede quitar la invitación a empresas que poseen reservas para el evento'
            ceppCompaniesError.style.display = 'block'
            errors +=1
        }else{
            ceppCompaniesError.style.display = 'none'
        }
    }    

    return errors
}

export {reserveQuotaValidations,editQuotaValidations,addStudentValidations,uploadExcelValidations,editEventValidations}

