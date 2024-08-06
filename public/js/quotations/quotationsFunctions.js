import qg from "./quotationsGlobals.js"

function filterQuotations() {

    qg.quotationsFiltered = qg.quotations

    //course
    qg.quotationsFiltered = filterCourse.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.event.id_courses == filterCourse.value)

    //company
    qg.quotationsFiltered = filterCompany.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_companies == filterCompany.value)

    //company
    qg.quotationsFiltered = filterCompany.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_companies == filterCompany.value)

}

export {filterQuotations}