import { printStudents } from "./printEventStudents.js"
import { uploadExcelValidations } from "./validations.js"
import eg from "./globals.js"
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

            const inputs = [cstppLastName,cstppFirstName,cstppDNI,cstppART]
            let id = eg.eventStudents.length == 0 ? 0 : eg.eventStudents.reduce((max, st) => (st.id > max ? st.id : max), eg.eventStudents[0].id) + 1

            const companyData = eg.idUserCategories == 4 ? eg.companies.filter(c => c.id == eg.idCompanies)[0] : eg.companies.filter(c => c.id == astppCompany.value)[0]

            data.forEach(element => {

                eg.eventStudents.push({
                    id: id,
                    dni:element[2],
                    art:element[3],
                    first_name:element[1],
                    id_companies:eg.idUserCategories == 4 ? eg.idCompanies : astppCompany.value,
                    id_courses:eg.idCourses,
                    id_events:eg.idEvents,
                    last_name:element[0],
                    medical_certificate:element[4] == 'si' ? 1 : 0,
                    company_data:companyData,
                    enabled:1
                })
                if (eg.idUserCategories != 4) {
                    eg.eventStudentsFiltered.push({
                        id: id,
                        dni:element[2],
                        art:element[3],
                        first_name:element[1],
                        id_companies:eg.idCompanies,
                        id_courses:eg.idCourses,
                        id_events:eg.idEvents,
                        last_name:element[0],
                        medical_certificate:element[4] == 'si' ? 1 : 0,
                        company_data:companyData,
                        enabled:1
                    })
                }

                id += 1
                
            })

            let loader
            let body
            
            if (eg.idUserCategories == 4) {
                loader = document.getElementById('cstppLoader')
                body = document.getElementById('cstppBody')
                printStudents(eg.eventStudents,loader,body)
                cstppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudents.length
            }else{document.getElementById('cstppBody')
                loader = document.getElementById('astppLoader')
                body = document.getElementById('astppBody')
                printStudents(eg.eventStudentsFiltered,loader,body)
                astppSubtitle2.innerHTML = '<b>Cupos reservados:</b> ' + eg.companyEventData.companyReservations + ' || <b>Cupos asignados: </b>' + eg.eventStudentsFiltered.length
            }

            clearInputs(inputs)

            uepp.style.display = 'none'
        }
    })
}

export {ueppEventListeners}