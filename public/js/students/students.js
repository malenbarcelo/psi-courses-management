import { dominio } from "../dominio.js"
import sg from "./globals.js"
import { printStudents } from "./printStudents.js"
import { applyFilters } from "./filters.js"
import { clearInputs,applyPredictElement } from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    studentsLoader.style.display = 'block'

    //get data
    sg.data = await (await fetch(dominio + 'apis/students/students-data')).json()
    sg.dataFiltered = sg.data
    
    //print data
    printStudents(sg.dataFiltered)

    //filters
    const filterCompany = document.getElementById('filterCompany')
    const filters = [filterCompany,filterName,filterDni,filterCourse,filterYear,filterMonth]
    
    filters.forEach(filter => {
        if (filter) {
            filter.addEventListener("change", async() => {
                applyFilters()
                printStudents(sg.dataFiltered)
            })
        }
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        clearInputs(filters)
        sg.dataFiltered = sg.data
        printStudents(sg.dataFiltered)
    })

    //predicts elements
    applyPredictElement(sg.elementsToPredict)

    // //download data
    DGAdownload.addEventListener("click", async() => {

        const data = sg.dataFiltered

        const response = await fetch('/apis/students/download-students', {
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
            a.download = 'alumnos.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
        } else {
            console.error('Error al descargar el archivo')
        }
    })
})
