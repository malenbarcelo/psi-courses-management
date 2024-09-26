
import { dateToString } from "../generalFunctions.js"

async function printStudents(dataToPrint) {

    studentsLoader.style.display = 'block'

    studentsBody.innerHTML = ''

    let html = dataToPrint.map((element, index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        return `
            <tr>
                <th class="${rowClass}">${element.last_name + ', ' + element.first_name }</th>
                <th class="${rowClass}">${element.dni }</th>
                <th class="${rowClass}">${element.company_data.company_name }</th>
                <th class="${rowClass}">${element.course_data.course_name }</th>
                <th class="${rowClass}">${'#' + String(element.event_data.id).padStart(8,'0')}</th>
                <th class="${rowClass}">${dateToString(element.event_data.start_date)}</th>
                <th class="${rowClass}">${dateToString(element.event_data.end_date)}</th>
        `;
    }).join('')

    studentsBody.innerHTML = html
    studentsLoader.style.display = 'none'

}

export {printStudents}