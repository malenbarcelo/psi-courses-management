import { dominio } from "../dominio.js"
import ug from "./usersGlobals.js"
import { showTableInfo } from "../generalFunctions.js"

//VIEW COMPANIES POPUP
async function vcppEventListeners() {

    //table info events listeners
    const tableIcons = [
        {
            icon:ecppIcon,
            right:'19.5%'
        },
        {
            icon:dcppIcon,
            right:'10.5%'
        }
    ]

    showTableInfo(tableIcons,57,150)
     
}

async function vcppPrintTable(dataToPrint) {

    console.log(dataToPrint)

    vcppLoader.style.display = 'block'

    vcppBody.innerHTML = ''

    let html = dataToPrint.map((element, index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const trashIcon = element.companies_users.length > 0 ? '' : '<i class="fa-regular fa-trash-can allowedIcon" id="delete_' + element.id + '}"></i>'

        return `
            <tr>
                <th class="${rowClass}">${element.company_name}</th>
                <th class="${rowClass}">${element.companies_users.length}</th>
                <th class="${rowClass}">
                    <i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i>
                </th>
                <th class="${rowClass}">${trashIcon}</th>
            </tr>
        `
    }).join('')

    vcppBody.innerHTML = html

    //quotationsHistoryEventListeners(dataToPrint)
    vcppLoader.style.display = 'none'
}

export {vcppEventListeners,vcppPrintTable}