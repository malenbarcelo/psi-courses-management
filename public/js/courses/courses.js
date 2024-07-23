import { dominio } from "../dominio.js"
import { printCourses, filterCourses,createCourseValidations,createEventValidations,updateSelectCourse,clickAllCompanies } from "./coursesFunctions.js"
import cg from "./coursesGlobals.js"
import { closePopupsEventListeners,showOkPopup,clearInputs,isValid} from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    coursesLoader.style.display = 'block'

    //get data and complete globals
    cg.companies = await (await fetch(dominio + 'apis/companies')).json()
    cg.courses = await (await fetch(dominio + 'apis/courses')).json()
    cg.coursesFiltered = cg.courses
    cg.companiesPerCourse = await (await fetch(dominio + 'apis/quota-reservations/companies-per-course')).json()
    cg.studentsPerCourse = await (await fetch(dominio + 'apis/events-students/students-per-course')).json()

    //complete select course
    updateSelectCourse()
    
    //print courses
    printCourses(cg.coursesFiltered)

    //filters event listeners
    const filters = [filterCourse]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterCourses()
            printCourses(cg.coursesFiltered)
        })
    })

    //close popups
    const closePopups = [ccoppClose,ccoppCancel,ceppClose,ceppCancel]
    closePopupsEventListeners(closePopups)

    //create course
    DGAcreateCourse.addEventListener("click", async() => {
        const inputs = [ccoppCourseName,ccoppCourseDescription,ccoppCourseQuota]
        clearInputs(inputs)
        isValid([ccoppCourseName])
        cg.action = 'create'
        ccoppTitle.innerText = 'CREAR CURSO'
        ccopp.style.display = 'block'
    })

    ccoppAccept.addEventListener("click", async() => {

        const errors = createCourseValidations()

        if (errors == 0) {
            const data = {
                course_name:ccoppCourseName.value,
                course_description:ccoppCourseDescription.value,
                course_quota:ccoppCourseQuota.value,
                id:cg.courseToEditId
            }

            if (cg.action == 'create') {
                await fetch(dominio + 'apis/courses/create-course',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                ccoppOkText.innerText = 'Curso creado con éxito'

            }else{
                await fetch(dominio + 'apis/courses/edit-course',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                ccoppOkText.innerText = 'Curso editado con éxito'
            }

            cg.courses = await (await fetch(dominio + 'apis/courses')).json()
            cg.coursesFiltered = cg.courses
    
            //print courses
            printCourses(cg.coursesFiltered)

            //update select course
            updateSelectCourse()

            ccopp.style.display = 'none'
            showOkPopup(ccoppOk)
        }
    })

    //create event
    ceppAllCompanies.addEventListener("click", async() => {
        clickAllCompanies()
    })

    cg.companies.forEach(company => {
        const checkCompany = document.getElementById('ceppCompany_' + company.id)
        checkCompany.addEventListener("click", async() => {
            if (checkCompany.checked) {
                cg.newEventInvitedCompanies.push(company.id)                
            }else{
                cg.newEventInvitedCompanies = cg.newEventInvitedCompanies.filter(c => c != company.id)
            }
        })
    })

    ceppAccept.addEventListener("click", async() => {

        const errors = createEventValidations()
        if (errors == 0) {
            
            const data = {
                id_courses:cg.newEventCourseId,
                invited_companies:cg.newEventInvitedCompanies,
                start_date:new Date(ceppStartDate.value + 'T03:00:00Z'),//to get argentina time
                end_date:new Date(ceppEndDate.value + 'T03:00:00Z'),//to get argentina time
                start_time:ceppStartTime.value,
                end_time:ceppEndTime.value,
                event_quota:ceppEventQuota.value
            }

            await fetch(dominio + 'apis/courses/create-event',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            cg.courses = await (await fetch(dominio + 'apis/courses')).json()
            cg.coursesFiltered = cg.courses
    
            //print courses
            printCourses(cg.coursesFiltered)

            cepp.style.display = 'none'
            showOkPopup(ceppOk)
        
        }
    })


})