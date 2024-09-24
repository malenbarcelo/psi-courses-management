import { addStudentAdmValidations } from "./validations.js"
import { printStudents } from "./printEventStudents.js"
import { filterStudents } from "./filters.js"
import eg from "./globals.js"
import { acceptWithEnter,clearInputs, isInvalid, isValid} from "../generalFunctions.js"

//ADMINISTARTOR STUDENTS POPUP (astpp)
async function astppEventListeners() {
    
    //change company
    const astppCompany = document.getElementById('astppCompany')
    const inputs = [astppCompany,astppLastName,astppFirstName,astppDNI,astppART]
    
    astppCompany.addEventListener("change", async() => {
        isValid(inputs)
        astppError.style.display = 'none'
        await filterStudents()
        printStudents(eg.eventStudentsFiltered,astppLoader,astppBody)
    })
    

    //add student
    astppAddStudent.addEventListener("click", async() => {
        
        const errors = await addStudentAdmValidations()

        if (errors == 0) {

            const inputs = [astppLastName,astppFirstName,astppDNI,astppART]
            const maxId = eg.eventStudents.length == 0 ? 0 : eg.eventStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventStudents[0].id)
            const companyData = eg.companies.filter(c => c.id == astppCompany.value)[0]

            eg.eventStudents.push({
                id: maxId + 1,
                dni:astppDNI.value,
                art:astppART.value,
                medical_certificate:1,
                first_name:astppFirstName.value,
                id_companies:astppCompany.value,
                id_courses:eg.idCourses,
                id_events:eg.idEvents,
                last_name:astppLastName.value,
                company_data:companyData,
                enabled:1
            })

            eg.eventStudentsFiltered.push({
                id: maxId + 1,
                dni:astppDNI.value,
                art:astppART.value,
                medical_certificate:1,
                first_name:astppFirstName.value,
                id_companies:astppCompany.value,
                id_courses:eg.idCourses,
                id_events:eg.idEvents,
                last_name:astppLastName.value,
                company_data:companyData,
                enabled:1
            })

            astppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyEventData.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudentsFiltered.length 

            clearInputs(inputs)
            
            printStudents(eg.eventStudentsFiltered,astppLoader,astppBody)
        }

    })

    acceptWithEnter(astppART,astppAddStudent)

    //accept
    astppAccept.addEventListener("click", async() => {
        if (!astppAcceptConditions.checked) {
            isInvalid([astppAcceptCheckbox])
            astppError2.style.display = 'block'
            
        }else{
            isValid([astppAcceptCheckbox])
            astppError2.style.display = 'none'
            sspp.style.display = 'block'
        }
        
    })

    //uploadExcelIcon
    astppUploadExcelIcon.addEventListener("click", async() => {

        if (astppCompany.value == '') {
            isInvalid([astppCompany])
        }else{
            isValid([astppCompany,astppLastName,astppFirstName,astppDNI,astppART,ueppDivInput])
            clearInputs([astppLastName,astppFirstName,astppDNI,astppART])
            
            ueppFile.value = ''
            astppError.style.display = 'none'
            ueppFileError.style.display = 'none'
            uepp.style.display = 'block'
        }
    })

    //download data
    astppDownloadExcelIcon.addEventListener("click", async() => {

        const data = {
            students: eg.eventStudents,
            eventData: eg.eventData
        }

        const response = await fetch('/apis/events/students/download-data', {
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
            a.download = 'alumnos.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
        } else {
            console.error('Error al descargar el archivo')
        }
    })
    
       
}

export {astppEventListeners}