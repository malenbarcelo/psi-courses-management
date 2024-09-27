import { addStudentValidations } from "./validations.js"
import { printStudents } from "./printEventStudents.js"
import { filterStudents } from "./filters.js"
import eg from "./globals.js"
import { acceptWithEnter,clearInputs, isInvalid, isValid} from "../generalFunctions.js"

//CUSTOMER STUDENTS POPUP (cstpp)
async function cstppEventListeners() {

    cstppClose.addEventListener("click", async() => {
        ccstpp.style.display = 'block'
    })
    
    //add student
    cstppAddStudent.addEventListener("click", async() => {
        
        const errors = await addStudentValidations()

        if (errors == 0) {

            const inputs = [cstppLastName,cstppFirstName,cstppDNI,cstppART]

            const maxId = eg.eventStudents.length == 0 ? 0 : eg.eventStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventStudents[0].id);

            eg.eventStudents.push({
                id: maxId + 1,
                dni:cstppDNI.value,
                art:cstppART.value,
                medical_certificate:1,
                first_name:cstppFirstName.value,
                id_companies:eg.idCompanies,
                id_courses:eg.idCourses,
                id_events:eg.idEvents,
                last_name:cstppLastName.value,
                enabled:1,
                company_data:{
                    id:eg.idCompanies,
                    company_name: eg.companies.filter(c => c.id == eg.idCompanies)[0].company_name,
                }
            })

            cstppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length 
            
            cstppMedicalCert.checked = false
            clearInputs(inputs)
            printStudents(eg.eventStudentsFiltered,cstppLoader,cstppBody)
        }

    })

    acceptWithEnter(cstppART,cstppAddStudent)

    //accept
    cstppAccept.addEventListener("click", async() => {
        if (eg.idUserCategories == 4 && !cstppAcceptConditions.checked) {
            isInvalid([cstppAcceptCheckbox])
            cstppError2.style.display = 'block'
            
        }else{
            isValid([cstppAcceptCheckbox])
            cstppError2.style.display = 'none'
            sspp.style.display = 'block'
        }
        
    })

    //uploadExcelIcon
    cstppUploadExcelIcon.addEventListener("click", async() => {
        
        isValid([cstppLastName,cstppFirstName,cstppDNI,cstppART,cstppCheckbox,ueppDivInput])
        clearInputs([cstppLastName,cstppFirstName,cstppDNI,cstppART])
        
        cstppMedicalCert.checked = false
        
        ueppFile.value = ''
        cstppError.style.display = 'none'
        ueppFileError.style.display = 'none'
        uepp.style.display = 'block'
        
    })

    //download data
    cstppDownloadExcelIcon.addEventListener("click", async() => {

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

export {cstppEventListeners}