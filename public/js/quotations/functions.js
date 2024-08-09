import qg from "./qGlobals.js"

function filterQuotations() {

    qg.quotationsFiltered = qg.quotations

    //course
    qg.quotationsFiltered = filterCourse.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.event.id_courses == filterCourse.value)

    //company
    qg.quotationsFiltered = filterCompany.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_companies == filterCompany.value)

//     //pending
//     if (!filterPending.checked) {
//         qg.quotationsFiltered = !filterPending.checked ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_quotations == null)
        
//     }
//     qg.quotationsFiltered = !filterPending.checked ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_quotations == null)

//     //in process
//     qg.quotationsFiltered = !filterInProcess.checked ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_quotations == 3)

// }

export {filterQuotations}