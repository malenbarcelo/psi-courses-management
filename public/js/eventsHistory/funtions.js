import eg from "./globals.js"

function applyFilters() {

    eg.dataFiltered = eg.data

    //company
    const filterCompany = document.getElementById('filterCompany')
    if (filterCompany) {
        eg.dataFiltered = filterCompany.value == '' ? eg.dataFiltered : eg.dataFiltered.filter(d => d.id_companies == filterCompany.value)
    }

    //course
    eg.dataFiltered = filterCourse.value == '' ? eg.dataFiltered : eg.dataFiltered.filter(d => d.id_courses == filterCourse.value)

    //student
    eg.dataFiltered = filterStudent.value == '' ? eg.dataFiltered : eg.dataFiltered.filter(d => d.last_name + ', ' + d.first_name == filterStudent.value)

    //dni
    eg.dataFiltered = filterDni.value == '' ? eg.dataFiltered : eg.dataFiltered.filter(d => d.dni == filterDni.value)

    //year
    eg.dataFiltered = filterYear.value == '' ? eg.dataFiltered : eg.dataFiltered.filter(d => d.event_data.start_date.split('-')[0] == filterYear.value)

    //month
    eg.dataFiltered = filterMonth.value == '' ? eg.dataFiltered : eg.dataFiltered.filter(d => d.event_data.start_date.split('-')[1] == String(filterMonth.value).padStart(2,'0'))
        
}


export {applyFilters}