import { printStudents, uploadExcelValidations } from "./eventsFunctions.js"
import eg from "./eventsGlobals.js"
import { clearInputs} from "../generalFunctions.js"

//UPLOAD EXCEL POPUP (uepp)
async function ueppEventListeners() {
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
            const maxId = eg.eventStudents.length == 0 ? 0 : eg.eventStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventStudents[0].id);

            data.forEach(element => {
                eg.eventStudents.push({
                    id: maxId + 1,
                    dni:element[3],
                    email:element[2],
                    first_name:element[1],
                    id_companies:eg.idCompanies,
                    id_courses:eg.idCourses,
                    id_events:eg.idEvents,
                    last_name:element[0]
                })
            })

            printStudents(eg.eventStudents)
            clearInputs(inputs)
            stppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length

            uepp.style.display = 'none'
        }

    })
    
    
    
       
}

export {ueppEventListeners}