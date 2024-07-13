import { dominio } from "../dominio.js"
import { printCourses, filterCourses,createCourseValidations,createEventValidations,updateSelectCourse,clickAllCompanies } from "./coursesFunctions.js"
import cg from "./coursesGlobals.js"
import { closePopupsEventListeners,showOkPopup,clearInputs,isValid} from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    //get data and complete globals
    cg.companies = await (await fetch(dominio + 'apis/companies')).json()
    cg.courses = await (await fetch(dominio + 'apis/courses')).json()
    cg.coursesFiltered = cg.courses

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
        ccopp.style.display = 'block'
    })

    ccoppAccept.addEventListener("click", async() => {

        const errors = createCourseValidations()

        if (errors == 0) {
            const data = {
                course_name:ccoppCourseName.value,
                course_description:ccoppCourseDescription.value,
                course_quota:ccoppCourseQuota.value,
            }

            await fetch(dominio + 'apis/courses/create-course',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

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
                start_date:ceppStartDate.value,
                end_date:ceppEndDate.value,
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