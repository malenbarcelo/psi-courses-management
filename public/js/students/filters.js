import sg from "./globals.js"

function applyFilters() {

    sg.dataFiltered = sg.data

    //company
    const filterCompany = document.getElementById('filterCompany')
    if (filterCompany) {
        sg.dataFiltered = filterCompany.value == '' ? sg.dataFiltered : sg.dataFiltered.filter(d => d.id_companies == filterCompany.value)
    }

    //name
    sg.dataFiltered = filterName.value == '' ? sg.dataFiltered : sg.dataFiltered.filter(d => d.last_name + ', ' + d.first_name == filterName.value)

    //dni
    sg.dataFiltered = filterDni.value == '' ? sg.dataFiltered : sg.dataFiltered.filter(d => d.dni == filterDni.value)

    //course
    sg.dataFiltered = filterCourse.value == '' ? sg.dataFiltered : sg.dataFiltered.filter(d => d.id_courses == filterCourse.value)

    //year
    sg.dataFiltered = filterYear.value == '' ? sg.dataFiltered : sg.dataFiltered.filter(d => d.year == filterYear.value)

    //month
    sg.dataFiltered = filterMonth.value == '' ? sg.dataFiltered : sg.dataFiltered.filter(d => d.month == String(filterMonth.value).padStart(2,'0'))

}


export {applyFilters}