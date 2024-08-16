import qg from "./qGlobals.js"
import { dominio } from "../dominio.js"
import { printQuotations } from "./printCards.js"
import { showOkPopup} from "../generalFunctions.js"

function filterQuotations() {

    qg.quotationsFiltered = qg.quotations

    //course
    qg.quotationsFiltered = filterCourse.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.event.id_courses == filterCourse.value)

    //company
    const filterCompany = document.getElementById('filterCompany')
    if (filterCompany) {
        qg.quotationsFiltered = filterCompany.value == '' ? qg.quotationsFiltered : qg.quotationsFiltered.filter(c => c.id_companies == filterCompany.value)
    }

    //status
    const filterInProcess_3 = document.getElementById('filterInProcess_3')
    let checks = [filterPending_4,filterQuoted_2]
    let checked = []
    
    if (filterInProcess_3) {
        checks.push(filterInProcess_3)        
    }

    checks.forEach(check => {
        if (check.checked) {
            checked.push(check.id.split('_')[1])            
        }        
    })

    if (qg.idUsersCategories == 4 && checked.includes(4)) {
        checked.push(3)
    }

    qg.quotationsFiltered = checked.length == 0 ? qg.quotationsFiltered : qg.quotationsFiltered.filter( q => checked.includes(String(q.id_quotations_status)))    
    
}

async function saveQuotation(type,popupToClose) {

    const data = {
        idQuotation: qg.editFrom == 'create' ? null : qg.idQuotationToEdit,
        quotationData:{
            quotation_number: qg.quotationNumber,
            subtotal:parseFloat(qg.quotationData.subtotal,2),
            discount:qg.quotationData.discount,
            total:qg.quotationData.total,
            id_status:type == 'save' ? 3 : 2,
            enabled:1
        },
        companyData:qg.companyData,
        quotationDetails:qg.elementsToQuote,
        id_status: type == 'save' ? 3 : 2
    }

    quotationsLoader.style.display = 'block'

    await fetch(dominio + 'apis/quotations/save-quotation',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    qg.quotations = await (await fetch(dominio + 'apis/quotations/in-progress-quotations')).json()
    qg.quotationsFiltered = qg.quotations
    qg.quotationsData = await (await fetch(dominio + 'apis/quotations/quotations-data')).json()
    qg.selectedElements = []
    qg.elementsToQuote = []
    qQuote.classList.add('qQuoteUnabled')

    //print in progress quotations
    printQuotations(qg.quotationsFiltered)

    //close popups if required
    if (popupToClose != null) {
        popupToClose.style.display = 'none'
    }
    
    cqpp.style.display = 'none'
    cqppOkText.innerText = type == 'save' ? 'Cotización guardada con éxito' : 'Cotización enviada con éxito'

    showOkPopup(cqppOk)
}

export {filterQuotations,saveQuotation}