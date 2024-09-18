import { addStudentValidations } from "./validations.js"
import { printStudents } from "./printEventStudents.js"
import { filterStudents } from "./filters.js"
import eg from "./globals.js"
import { acceptWithEnter,clearInputs, isInvalid, isValid} from "../generalFunctions.js"

//STUDENTS POPUP (stpp)
async function stppEventListeners() {
    
    //change company
    const stppCompany = document.getElementById('stppCompany')
    if (stppCompany) {
        stppCompany.addEventListener("change", async() => {
            await filterStudents()
            printStudents(eg.eventStudentsFiltered)
        })
    }

    //add student
    stppAddStudent.addEventListener("click", async() => {
        
        const errors = addStudentValidations()

        if (errors == 0) {

            const inputs = [stppLastName,stppFirstName,stppDNI,stppART]

            if (eg.studentsFrom == 'Administrator') {
                inputs.push('stppCompany')
            }

            const maxId = eg.eventStudents.length == 0 ? 0 : eg.eventStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventStudents[0].id);

            eg.eventStudents.push({
                id: maxId + 1,
                dni:stppDNI.value,
                art:stppART.value,
                medical_certificate:1,
                first_name:stppFirstName.value,
                id_companies:eg.studentsFrom == 'customer' ? eg.idCompanies : stppCompany.value,
                id_courses:eg.idCourses,
                id_events:eg.idEvents,
                last_name:stppLastName.value,
                company_data:{
                    id:eg.studentsFrom == 'customer' ? eg.idCompanies : stppCompany.value,
                    company_name: eg.companies.filter(c => c.id == (eg.studentsFrom == 'customer' ? eg.idCompanies : stppCompany.value))[0].company_name,
                }
            })

            if (eg.studentsFrom == 'administrator') {
                await filterStudents()
            }else{
                stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length 
            }

            clearInputs(inputs)
            printStudents(eg.eventStudentsFiltered)
        }

    })

    acceptWithEnter(stppDNI,stppAddStudent)

    //accept
    stppAccept.addEventListener("click", async() => {
        if (!stppAcceptConditions.checked) {
            isInvalid([stppAcceptCheckbox])
            stppError2.style.display = 'block'
            
        }else{
            isValid([stppAcceptCheckbox])
            stppError2.style.display = 'none'
            sspp.style.display = 'block'
        }
        
    })

    //uploadExcelIcon
    stppUploadExcelIcon.addEventListener("click", async() => {
        isValid([stppLastName,stppFirstName,stppDNI,stppART,stppCheckbox,ueppDivInput])
        clearInputs([stppLastName,stppFirstName,stppDNI,stppART])
        stppMedicalCert.checked = false
        stppError.style.display = 'none'
        ueppFileError.style.display = 'none'
        uepp.style.display = 'block'
    })

    //download data
    stppDownloadExcelIcon.addEventListener("click", async() => {

        const data = {
            students: eg.eventStudents,
            eventData: eg.eventData
        }

        console.log(data)

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
            a.download = 'historial_de_eventos.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
        } else {
            console.error('Error al descargar el archivo')
        }
    })
    
       
}

export {stppEventListeners}