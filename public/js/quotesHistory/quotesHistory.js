import { dominio } from "../dominio.js"
import qg from "../quotations/qGlobals.js"
import { printTableQuotations } from "../quotesHistory/printTables.js"
import {applyFilters } from "../quotesHistory/functions.js"
import { closePopupsEventListeners, showOkPopup, showTableInfo,uncheckInputs,clearInputs} from "../generalFunctions.js"

// //popups event listeners
// import { aeppEventListeners} from "../quotations/quotationsAEPP.js"

window.addEventListener('load',async()=>{

    quotesHistoryLoader.style.display = 'block'

    //get data and complete globals
    qg.idUsersCategories = idUsersCategories.innerText
    qg.idCompanies = idCompanies.innerText
    qg.quotations = await (await fetch(dominio + 'apis/quotations/all-data')).json()
    qg.quotationsFiltered = qg.quotations
    
    //print quotations
    printTableQuotations(qg.quotationsFiltered)

    //table info events listeners
    const tableIcons = [
        {
            icon:vdppIcon,
            right:'23.5%'
        },
        {
            icon:dfppIcon,
            right:'19.5%'
        },
        {
            icon:dqppIcon,
            right:'15.5%'
        },
    ]

    showTableInfo(tableIcons,250,100)

    //close popups
    const closePopups = []
    closePopupsEventListeners(closePopups)

    //accept with enter
    const inputToEnter = []
    inputToEnter.forEach(element => {
        acceptWithEnter(element[0],element[1])
    })

    //filters
    const filterCompany = document.getElementById('filterCompany')
    const filterInProcess_3 = document.getElementById('filterInProcess_3')
    const filters = [filterCompany,filterYear,filterMonth,filterInProcess_3,filterAproved_1,filterQuoted_2,filterRefused_6]
    filters.forEach(filter => {
        if(filter){
            filter.addEventListener("change", async() => {
                applyFilters()
                printTableQuotations(qg.quotationsFiltered)
            })
        }
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        uncheckInputs([filterInProcess_3,filterAproved_1,filterQuoted_2,filterRefused_6])
        clearInputs([filterCompany,filterYear,filterMonth])
        qg.quotationsFiltered = qg.quotations        
        printTableQuotations(qg.quotationsFiltered)
    })

    // //create quote button
    // const qQuote = document.getElementById('qQuote')
    // if (qQuote) {
    //     qQuote.addEventListener("click", async() => {

    //         qg.editFrom = 'create'
    
    //         if (qg.selectedElements.length > 0) {            
    //             //validations
    //             const companies = []
    
    //             qg.selectedElements.forEach(element => {
    //                 if (!companies.includes(element.id_companies)) {
    //                     companies.push(element.id_companies)
    //                 }
    //             })
    
    //             if (companies.length > 1) {
    //                 showOkPopup(cqppError)
    //             }else{
    
    //                 //get quotation number
    //                 qg.quotationData.discount = 0
    
    //                 //get quotation number
    //                 qg.companyData = qg.selectedElements[0].company
    
    //                 //get quotation number
    //                 qg.quotationNumber = qg.quotationsData.length == 0 ? 1 : qg.quotationsData.reduce((max, obj) => (obj.quotation_number > max ? obj.quotation_number : max), 0) + 1
    
    //                 //complete popup titles                
    //                 cqppMainTitle.innerText = qg.companyData.company_name
    //                 cqppSubtitle.innerText = 'Cotización #' + String(qg.quotationNumber).padStart(6,'0')
                    
    //                 qg.elementsToQuote = []
    
    //                 qg.selectedElements.forEach(element => {
    //                     qg.elementsToQuote.push({
    //                         id:element.id,
    //                         id_events:element.id_events,
    //                         description: element.event.events_courses.course_name + ' - Evento #' + String(element.id_events).padStart(8,'0'),
    //                         unit_price:null,
    //                         quantity:parseInt(qg.reservationsPerCompany.filter(r => r.id_events == element.id_events && r.id_companies == element.id_companies)[0].total_quota_reservations),
    //                         subtotal:null,
    //                         id_companies:element.id_companies,
    //                         discount:0,
    //                         total:null,
    //                         companyData:element.company,
    //                         eventData:element.event,
    //                         type:1
    //                     })
    //                 })
    
    //                 printTableQuotation(qg.elementsToQuote)
    
    //                 cqpp.style.display = 'block'
    //             }
    //         }
    //     })
    // }
    

    // //ADD EVENT POPUP EVENT LISTENERS (aepp)
    // aeppEventListeners()

    // //ADD LINE POPUP EVENT LISTENERS (alpp)
    // alppEventListeners()

    // //CREATE QUOTE POPUP EVENT LISTENERS (cqpp)
    // cqppEventListeners()

    // //EDIT DISCOUNT POPUP EVENT LISTENERS (edpp)
    // edppEventListeners()

    // //EDIT LINE POPUP EVENT LISTENERS (elpp)
    // elppEventListeners()

    // //NO QUOTATION POPUP EVENT LISTENERS (nqpp)
    // nqppEventListeners()

    // //SEND QUOTATION POPUP EVENT LISTENERS (sqpp)
    // sqppEventListeners()

    // //DELETE QUOTATION POPUP EVENT LISTENERS (dqpp)
    // dqppEventListeners()

    // //UPLOAD ORDER POPUP EVENT LISTENERS (uopp)
    // uoppEventListeners()

    // //ACCEPT QUOTATION POPUP EVENT LISTENERS (aqpp)
    // aqppEventListeners()


})