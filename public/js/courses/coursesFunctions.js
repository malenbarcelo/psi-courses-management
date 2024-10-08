import { dominio } from "../dominio.js"
import cg from "./coursesGlobals.js"
import {isInvalid,isValid,dateToString,clearInputs } from "../generalFunctions.js"

async function printCourses(dataToPrint) {

    coursesLoader.style.display = 'block';
    divCourses.innerHTML = '';

    const fragment = document.createDocumentFragment();

    dataToPrint.forEach(element => {

        const today = new Date()
        const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        let courseCompanies = cg.companiesPerCourse.filter( cpc => cpc.id_courses == element.id)
        courseCompanies = courseCompanies.length == 0 ? 0 : courseCompanies[0].course_companies
        let courseStudents = cg.studentsPerCourse.filter( spc => spc.id_courses == element.id)
        courseStudents = courseStudents.length == 0 ? 0 : courseStudents[0].course_students


        //get next events
        let filterEvents = element.courses_courses_events.filter(e => {
            const startDate = new Date(e.start_date)
            return startDate > todayNormalized
        })
        
        if (filterEvents.length > 0) {
            filterEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))            
        }

        const nextEvent = filterEvents.length == 0 ? 'No hay eventos programados' : filterEvents[0].start_date
        const nextEventString = nextEvent == 'No hay eventos programados' ? nextEvent : dateToString(nextEvent)

        const divCourse = document.createElement('div');
        divCourse.id = 'divCourse';

        const courseTitle = document.createElement('div');
        courseTitle.id = 'courseTitle';
        courseTitle.textContent = element.course_name;

        const courseNextEvent = document.createElement('div');
        courseNextEvent.id = 'courseNextEvent';
        courseNextEvent.innerHTML = '<div><b>Próximo evento:</b></div><div>' + nextEventString + '</div>';

        const courseInfo = document.createElement('div');
        courseInfo.id = 'courseInfo';
        courseInfo.innerHTML = '<div><b>Empresas: </b> ' + courseCompanies + '</div><div><b>Alumnos: </b> ' + courseStudents + '</div>';

        const coursesActions = document.createElement('div');
        coursesActions.id = 'courseActions';

        const viewDetailsAction = document.createElement('div');
        viewDetailsAction.className = 'courseAction';
        viewDetailsAction.innerHTML = '<i class="fa-regular fa-pen-to-square icon" id="edit_' + element.id + '"></i><div class="courseActionInfo1">Editar curso</div>';

        const createEventAction = document.createElement('div');
        createEventAction.className = 'courseAction';
        createEventAction.innerHTML = '<i class="fa-regular fa-calendar-plus icon" id="create_' + element.id + '"></i><div class="courseActionInfo1">Crear evento</div>';

        coursesActions.appendChild(viewDetailsAction);
        coursesActions.appendChild(createEventAction);

        divCourse.appendChild(courseTitle);
        divCourse.appendChild(courseNextEvent);
        divCourse.appendChild(courseInfo);
        divCourse.appendChild(coursesActions);

        fragment.appendChild(divCourse);
    });

    divCourses.appendChild(fragment);

    addCoursesEventListeners(dataToPrint);

    coursesLoader.style.display = 'none';
}

function addCoursesEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const create = document.getElementById('create_' + element.id)

        //create event        
        create.addEventListener('click',async()=>{
            const inputs = [ceppStartDate,ceppEndDate,ceppStartTime,ceppEndTime,ceppEventQuota]
            const errors = [ceppDateError,ceppTimeError,ceppCompaniesError]
            clearInputs(inputs)
            isValid(inputs)
            errors.forEach(error => {
                error.style.display = 'none'
            })
            
            ceppTitle.innerText = element.course_name
            ceppSubtitle.innerText = 'CREAR EVENTO'
            ceppEventQuota.value = element.course_quota
            ceppAllCompanies.checked = true
            clickAllCompanies()
            cg.newEventCourseId = element.id
            cepp.style.display = 'block'
        })

        //edit course        
        edit.addEventListener('click',async()=>{
            const inputs = [ccoppCourseName,ccoppCourseDescription,ccoppCourseQuota]
            cg.action = 'edit'
            cg.courseToEditId = element.id
            cg.courseToEditName = element.course_name
            ccoppTitle.innerText = 'EDITAR CURSO'
            clearInputs(inputs)
            isValid([ccoppCourseName])
            ccoppCourseName.value = element.course_name
            ccoppCourseDescription.value = element.course_description
            ccoppCourseQuota.value = element.course_quota            
            ccopp.style.display = 'block'
        })
    })
}

function filterCourses() {

    cg.coursesFiltered = cg.courses

    //course
    cg.coursesFiltered = filterCourse.value == '' ? cg.coursesFiltered : cg.coursesFiltered.filter(c => c.id == filterCourse.value)

}

function createCourseValidations() {

    let errors = 0
    
    //course name
    if (ccoppCourseName) {
        if (ccoppCourseName.value == '' || ccoppCourseName.value == 0) {
            ccoppCourseNameError.innerText = 'Debe completar el nombre del curso'
            isInvalid([ccoppCourseName])
            errors += 1            
        }else{
            const findCourse = cg.courses.filter(c => c.course_name == ccoppCourseName.value)
            if (findCourse.length > 0 && (cg.action == 'create' || cg.courseToEditName != ccoppCourseName.value)) {
                ccoppCourseNameError.innerText = 'Ya existe un curso con el nombre seleccionado'
                isInvalid([ccoppCourseName])
                errors += 1
            }else{
                isValid([ccoppCourseName])
            }
        }   
    }

    return errors
}

function createEventValidations() {

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
        isValid([ceppEventQuota])
        ceppEventQuotaError.style.display = 'none'
    }

    //companies
    if (cg.newEventInvitedCompanies.length == 0) {
        ceppCompaniesError.style.display = 'block'
        errors +=1
    }else{
        ceppCompaniesError.style.display = 'none'
    }

    return errors
}

function updateSelectCourse() {

    filterCourse.innerHTML = '<option value="">Todos los cursos</option>'

    cg.courses.forEach(course => {
        filterCourse.innerHTML += '<option value="' +  course.id + '">'+ course.course_name + '</option>'
    })
}

function clickAllCompanies() {
    if (ceppAllCompanies.checked) {
        cg.companies.forEach(company => {
            const check = document.getElementById('ceppCompany_' + company.id)
            check.checked = true
            cg.newEventInvitedCompanies.push(company.id)                       
        })

    }else{
        cg.companies.forEach(company => {
            const check = document.getElementById('ceppCompany_' + company.id)
            check.checked = false
        })
        cg.newEventInvitedCompanies = []         
    }
}

export {printCourses,filterCourses,createCourseValidations,createEventValidations,updateSelectCourse,clickAllCompanies}