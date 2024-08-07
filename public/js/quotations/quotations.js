import { dominio } from "../dominio.js"
import { printQuotations } from "./quotationsPrintCards.js"
import { printTableQuotation } from "./quotationsPrintTables.js"
import { nqppEventListeners,cqppEventListeners } from "./quotationsPopups.js"
import {filterQuotations } from "./quotationsFunctions.js"
import { closePopupsEventListeners, showOkPopup, uncheckInputs, clearInputs, acceptWithEnter} from "../generalFunctions.js"
import qg from "./quotationsGlobals.js"

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
                const quotationNumber = '#' + String(qg.quotationsData.length == 0 ? 1 : (qg.quotationsData.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1)).padStart(6,'0')
                cqppMainTitle.innerText = companyData[0].company.company_name
                cqppSubtitle.innerText = 'Cotización ' + quotationNumber

                printTableQuotation(qg.elementsToQuote)

                cqpp.style.display = 'block'
            }
        }

        
    })

    //NO QUOTATION POPUP EVENT LISTENERS (nqpp)
    nqppEventListeners()

    //CREATE QUOTE POPUP EVENT LISTENERS (cqpp)
    cqppEventListeners()


})