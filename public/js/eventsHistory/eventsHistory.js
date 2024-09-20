import { dominio } from "../dominio.js"
import eg from "./globals.js"
import { printEventsHistory } from "./printTables.js"
import { applyFilters } from "./funtions.js"
import { clearInputs,closePopupsEventListeners,predictElements,selectFocusedElement } from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    eventsHistoryLoader.style.display = 'block'
    
    //get data and complete globals
    eg.idCompanies = idCompanies.innerText
    eg.idUsersCategories = idUsersCategories.innerText
    
    const userData = {
        id_companies: eg.idCompanies,
        idUserCategories:eg.idUsersCategories,
    }

    const response = await fetch(dominio + 'apis/events/events-history/get-data',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    })

    eg.data = await response.json()    
    eg.dataFiltered = eg.data
    
    //print data
    printEventsHistory(eg.dataFiltered)

    //filters event listeners
    const filterCompany = document.getElementById('filterCompany')
    const filters = [filterCompany,filterCourse,filterStudent,filterDni,filterYear,filterMonth]
    
    filters.forEach(filter => {
        if (filter) {
            filter.addEventListener("change", async() => {
                applyFilters()
                printEventsHistory(eg.dataFiltered)
            })
        }
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        clearInputs([filterCompany,filterCourse,filterStudent,filterDni,filterYear,filterMonth])
        eg.dataFiltered = eg.data
        printEventsHistory(eg.dataFiltered)
    })

    //filter student predict elements
    filterStudent.addEventListener("input", async(e) => {
        const input = filterStudent
        const list = ulPredictedStudents
        const apiUrl = 'apis/events/events-students/predict-students/'
        const name = 'student'
        const elementName = 'student'
        predictElements(input,list,apiUrl,name,elementName)
    })

    filterStudent.addEventListener("keydown", async(e) => {
        const input = filterStudent
        const list = ulPredictedStudents
        const elementName = 'student'
        selectFocusedElement(e,input,list,elementName)
    })

    //close popups
    const closePopups = [cqppClose, cqppCancel]
    closePopupsEventListeners(closePopups)

    //download data
    DGAdownload.addEventListener("click", async() => {

        const data = eg.dataFiltered

        const response = await fetch('/apis/events/events-history/download-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'historial_de_eventos.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
        } else {
            console.error('Error al descargar el archivo')
        }
    })
})
