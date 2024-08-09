import { dominio } from "../dominio.js"
import { printQuotations } from "./printCards.js"
import { printTableQuotation } from "./printTables.js"
import {filterQuotations } from "./functions.js"
import { closePopupsEventListeners, showOkPopup, uncheckInputs, clearInputs, acceptWithEnter} from "../generalFunctions.js"
import qg from "./qGlobals.js"

//popups event listeners
import { aeppEventListeners} from "./quotationsAEPP.js"
import { alppEventListeners} from "./quotationsALPP.js"
import { cqppEventListeners} from "./quotationsCQPP.js"
import { edppEventListeners} from "./quotationsEDPP.js"
import { elppEventListeners} from "./quotationsELPP.js"
import { nqppEventListeners} from "./quotationsNQPP.js"

window.addEventListener('load',async()=>{

    //get data and complete globals
    qg.idCompanies = document.getElementById('idCompany').innerText
    qg.idUserCategories = document.getElementById('idUserCategories').innerText
    qg.reservationsPerCompany = await (await fetch(dominio + 'apis/quota-reservations/reservations-per-event-company')).json()
    qg.quotations = await (await fetch(dominio + 'apis/quotations/in-progress-quotations')).json()
    qg.quotationsFiltered = qg.quotations
    qg.quotationsData = await (await fetch(dominio + 'apis/quotations/quotations-data')).json()
    
    //print in progress quotations
    printQuotations(qg.quotationsFiltered)

    //close popups
    const closePopups = [nqppClose,nqppCancel,cqppClose,aeppClose,aeppCancel,alppClose,alppCancel,edppCancel,edppClose,elppClose,elppCancel]
    closePopupsEventListeners(closePopups)

    //accept with enter
    const inputToEnter = [[aeppEvent,aeppAccept],[alppDescription,alppAccept],[edppDiscount,edppAccept]]
    inputToEnter.forEach(element => {
        acceptWithEnter(element[0],element[1])
    })

    //filters
    const filters = [filterCourse,filterCompany,filterPending,filterInProcess,filterQuoted]
    filters.forEach(filter => {        
        filter.addEventListener("change", async() => {
            filterQuotations()
            printQuotations(qg.quotationsFiltered)
        })
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        uncheckInputs([filterPending,filterInProcess,filterQuoted])
        clearInputs([filterCourse,filterCompany])
        qg.quotationsFiltered = qg.quotations        
        printQuotations(qg.quotationsFiltered)
    })

    //create quote button
    qQuote.addEventListener("click", async() => {

        if (qg.selectedElements.length > 0) {            
            //validations
            const companies = []
            const companyData = []

            qg.selectedElements.forEach(element => {
                if (!companies.includes(element.id_companies)) {
                    companies.push(element.id_companies)
                    companyData.push(element)
                }
            })
            
            if (companies.length > 1) {
                showOkPopup(cqppError)
            }else{
                qg.companyData = companyData[0]
                qg.quotationNumber = qg.quotationsData.length == 0 ? 1 : qg.quotationsData.reduce((max, obj) => (obj.quotation_number > max ? obj.quotation_number : max), 0) + 1
                cqppMainTitle.innerText = companyData[0].company.company_name
                cqppSubtitle.innerText = 'Cotización #' + String(qg.quotationNumber).padStart(6,'0')

                qg.elementsToQuote = []
                
                const maxId = qg.elementsToQuote.length == 0 ? 0 : qg.elementsToQuote.reduce((max, obj) => (obj.id > max ? obj.id : max), qg.elementsToQuote[0].id)

                qg.selectedElements.forEach(element => {
                    qg.elementsToQuote.push({
                        id:maxId + 1,
                        description: element.event.events_courses.course_name + ' - Evento #' + String(element.id_events).padStart(8,'0'),
                        unit_price:null,
                        quantity:parseInt(qg.reservationsPerCompany.filter(r => r.id_events == element.id_events && r.id_companies == element.id_companies)[0].total_quota_reservations),
                        subtotal:null,
                        discount:0,
                        total:null,
                        data:element
                    })
                })

                printTableQuotation(qg.elementsToQuote)

                cqpp.style.display = 'block'
            }
        }

        
    })

    //ADD EVENT POPUP EVENT LISTENERS (aepp)
    aeppEventListeners()

    //ADD LINE POPUP EVENT LISTENERS (alpp)
    alppEventListeners()

    //CREATE QUOTE POPUP EVENT LISTENERS (cqpp)
    cqppEventListeners()

    //EDIT DISCOUNT POPUP EVENT LISTENERS (edpp)
    edppEventListeners()

    //EDIT LINE POPUP EVENT LISTENERS (elpp)
    elppEventListeners()

    //NO QUOTATION POPUP EVENT LISTENERS (nqpp)
    nqppEventListeners()

})