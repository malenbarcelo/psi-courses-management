import { dominio } from "../dominio.js"
import { printQuotations } from "./printCards.js"
import { printTableQuotation } from "./printTables.js"
import {filterQuotations,completeQuotationStatus } from "./functions.js"
import { closePopupsEventListeners, showOkPopup, uncheckInputs, clearInputs, acceptWithEnter} from "../generalFunctions.js"
import qg from "./qGlobals.js"

//popups event listeners
import { aeppEventListeners} from "./quotationsAEPP.js"
import { alppEventListeners} from "./quotationsALPP.js"
import { cqppEventListeners} from "./quotationsCQPP.js"
import { edppEventListeners} from "./quotationsEDPP.js"
import { elppEventListeners} from "./quotationsELPP.js"
import { nqppEventListeners} from "./quotationsNQPP.js"
import { sqppEventListeners} from "./quotationsSQPP.js"
import { dqppEventListeners} from "./quotationsDQPP.js"
import { uoppEventListeners} from "./quotationsUOPP.js"
import { aqppEventListeners} from "./quotationsAQPP.js"
import { reqppEventListeners} from "./quotationsREQPP.js"

window.addEventListener('load',async()=>{

    quotationsLoader.style.display = 'block'

    //get data and complete globals
    qg.idUsersCategories = idUsersCategories.innerText
    qg.idCompanies = idCompanies.innerText
    qg.reservationsPerCompany = await (await fetch(dominio + 'apis/quota-reservations/reservations-per-event-company')).json()
    qg.quotations = await (await fetch(dominio + 'apis/quotations/in-progress-quotations')).json()
    qg.quotationsFiltered = qg.quotations
    qg.quotationsData = await (await fetch(dominio + 'apis/quotations/quotations-data')).json()
    
    printQuotations(qg.quotationsFiltered)
    

    //close popups
    const closePopups = [nqppClose,nqppCancel,cqppClose,aeppClose,aeppCancel,alppClose,alppCancel,edppCancel,edppClose,elppClose,elppCancel,sqppClose,sqppCancel,dqppClose,dqppCancel,uoppClose,uoppCancel,aqppClose,aqppCancel,reqppClose,reqppCancel]
    closePopupsEventListeners(closePopups)

    //accept with enter
    const inputToEnter = [[aeppEvent,aeppAccept],[alppDescription,alppAccept],[edppDiscount,edppAccept]]
    inputToEnter.forEach(element => {
        acceptWithEnter(element[0],element[1])
    })

    //filters
    const filterInProcess_3 = document.getElementById('filterInProcess_3')
    const filterCompany = document.getElementById('filterCompany')
    const filters = [filterCourse,filterCompany,filterPending_4,filterQuoted_2,filterInProcess_3]
    filters.forEach(filter => {
        if(filter){
            filter.addEventListener("change", async() => {
                filterQuotations()
                printQuotations(qg.quotationsFiltered)
            })
        }
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        uncheckInputs([filterPending,filterInProcess,filterQuoted])
        clearInputs([filterCourse,filterCompany])
        qg.quotationsFiltered = qg.quotations        
        printQuotations(qg.quotationsFiltered)
    })

    //create quote button
    const qQuote = document.getElementById('qQuote')
    if (qQuote) {
        qQuote.addEventListener("click", async() => {

            qg.editFrom = 'create'
            cqppError2.style.display = 'none'
    
            if (qg.selectedElements.length > 0) {            
                //validations
                const companies = []
    
                qg.selectedElements.forEach(element => {
                    if (!companies.includes(element.id_companies)) {
                        companies.push(element.id_companies)
                    }
                })
    
                if (companies.length > 1) {
                    showOkPopup(cqppError)
                }else{
    
                    //get quotation number
                    qg.quotationData.discount = 0
    
                    //get quotation number
                    qg.companyData = qg.selectedElements[0].company
    
                    //get quotation number
                    qg.quotationNumber = qg.quotationsData.length == 0 ? 1 : qg.quotationsData.reduce((max, obj) => (obj.quotation_number > max ? obj.quotation_number : max), 0) + 1
    
                    //complete popup titles                
                    cqppMainTitle.innerText = qg.companyData.company_name
                    cqppSubtitle.innerText = 'Cotización #' + String(qg.quotationNumber).padStart(6,'0')
                    
                    qg.elementsToQuote = []
    
                    qg.selectedElements.forEach(element => {
                        qg.elementsToQuote.push({
                            id:element.id,
                            id_events:element.id_events,
                            description: element.event.events_courses.course_name + ' - Evento #' + String(element.id_events).padStart(8,'0'),
                            unit_price:null,
                            quantity:parseInt(qg.reservationsPerCompany.filter(r => r.id_events == element.id_events && r.id_companies == element.id_companies)[0].total_quota_reservations),
                            subtotal:null,
                            id_companies:element.id_companies,
                            discount:0,
                            total:null,
                            companyData:element.company,
                            eventData:element.event,
                            type:1
                        })
                    })
    
                    printTableQuotation(qg.elementsToQuote)

                    completeQuotationStatus('BORRADOR',3)
    
                    cqpp.style.display = 'block'
                }
            }
        })
    }

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

    //SEND QUOTATION POPUP EVENT LISTENERS (sqpp)
    sqppEventListeners()

    //DELETE QUOTATION POPUP EVENT LISTENERS (dqpp)
    dqppEventListeners()

    //UPLOAD ORDER POPUP EVENT LISTENERS (uopp)
    uoppEventListeners()

    //ACCEPT QUOTATION POPUP EVENT LISTENERS (aqpp)
    aqppEventListeners()

    //REFUSE QUOTATION POPUP EVENT LISTENERS (reqpp)
    reqppEventListeners()


})