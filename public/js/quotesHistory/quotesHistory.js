import { dominio } from "../dominio.js"
import qg from "../quotations/qGlobals.js"
import { printTableQuotations } from "../quotesHistory/printTables.js"
import {applyFilters } from "../quotesHistory/functions.js"
import { closePopupsEventListeners, showOkPopup, showTableInfo,uncheckInputs,clearInputs} from "../generalFunctions.js"

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
        }
    ]

    showTableInfo(tableIcons,252,100)

    //close popups
    const closePopups = [cqppClose,cqppCancel]
    closePopupsEventListeners(closePopups)

    //accept with enter
    const inputToEnter = []
    inputToEnter.forEach(element => {
        acceptWithEnter(element[0],element[1])
    })

    //filters
    const filterCompany = document.getElementById('filterCompany')
    const filterInProcess_3 = document.getElementById('filterInProcess_3')
    const filterCanceled_7 = document.getElementById('filterCanceled_7')
    const filters = [filterCompany,filterYear,filterMonth,filterInProcess_3,filterAproved_1,filterQuoted_2,filterRefused_6,filterCanceled_7]
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

})