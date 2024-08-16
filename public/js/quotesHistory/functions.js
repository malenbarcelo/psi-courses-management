import qg from "../quotations/qGlobals.js"
import { dominio } from "../dominio.js"

function applyFilters() {

    qg.quotationsFiltered = qg.quotations

    //company
    const filterCompany = document.getElementById('filterCompany')
    if (filterCompany) {
        qg.quotationsFiltered = filterCompany.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_companies == filterCompany.value)
    }

    //year
    qg.quotationsFiltered = filterYear.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => parseInt(c.created_at.split('T')[0].split('-')[0]) == filterYear.value)

    //month
    qg.quotationsFiltered = filterMonth.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => parseInt(c.created_at.split('T')[0].split('-')[1]) == parseInt(filterMonth.value))

    //status
    const filterInProcess_3 = document.getElementById('filterInProcess_3')
    let checks = [filterAproved_1,filterQuoted_2,filterRefused_6]
    let checked = []
    
    if (filterInProcess_3) {
        checks.push(filterInProcess_3)        
    }

    checks.forEach(check => {
        if (check.checked) {
            checked.push(check.id.split('_')[1])            
        }        
    })

    qg.quotationsFiltered = checked.length == 0 ? qg.quotationsFiltered : qg.quotationsFiltered.filter( q => checked.includes(String(q.id_status)))    
    
}



export {applyFilters}