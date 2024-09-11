import { addStudentValidations } from "./validations.js"
import { printStudents } from "./printEventStudents.js"
import { filterStudents } from "./filters.js"
import eg from "./globals.js"
import { acceptWithEnter,clearInputs, isValid} from "../generalFunctions.js"

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

            const inputs = [stppLastName,stppFirstName,stppEmail,stppDNI]
            if (eg.studentsFrom == 'Administrator') {
                inputs.push('stppCompany')
            }

            const maxId = eg.eventStudents.length == 0 ? 0 : eg.eventStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventStudents[0].id);

            eg.eventStudents.push({
                id: maxId + 1,
                dni:stppDNI.value,
                email:stppEmail.value,
                first_name:stppFirstName.value,
                id_companies:eg.studentsFrom == 'customer' ? eg.idCompanies : stppCompany.value,
                id_courses:eg.idCourses,
                id_events:eg.idEvents,
                last_name:stppLastName.value,
                students_companies:{
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
        sspp.style.display = 'block'
    })

    //uploadExcelIcon
    stppUploadExcelIcon.addEventListener("click", async() => {
        isValid([stppLastName,stppFirstName,stppEmail,stppDNI])
        clearInputs([stppLastName,stppFirstName,stppEmail,stppDNI])
        stppError.style.display = 'none'
        uepp.style.display = 'block'
    })
    
       
}

export {stppEventListeners}