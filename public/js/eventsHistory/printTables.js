
import { dateToString } from "../generalFunctions.js"
import eg from "./globals.js"
import quotationsGlobals from "../quotations/qGlobals.js"
import { printTableQuotation } from "../quotations/printTables.js"
import { completeQuotationStatus } from "../quotations/functions.js"

async function printEventsHistory(dataToPrint) {

    eventsHistoryLoader.style.display = 'block'

    bodyEventsHistory.innerHTML = ''

    let html = dataToPrint.map((element, index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        let quotationNumber = element.quotation_data.requires_quotation == 0 ? 'S/C' : (element.quotation_data.id_quotations == null ? 'Pendiente' : ('#' + String(element.quotation_data.quotation.quotation_number).padStart(6,'0')))
        
        quotationNumber = (element.quotation_data.id_quotations_status == 3 && eg.idUsersCategories == 4) ? 'Pendiente' : quotationNumber
        
        const downloadPO = (element.quotation_data.id_quotations == null || element.quotation_data.quotation.quotations_purchase_orders == null) ? '' : '<i class="fa-regular fa-file-pdf allowedIcon" id="download_'+ element.id +'"></i>'

        const quotationColor = quotationNumber == 'S/C' ? 'blackColor' : (quotationNumber == 'Pendiente' ? 'redColor' : (element.quotation_data.id_quotations_status == 1 ? 'greenColor' : 'yellowColor'))
        
        return `
            <tr>
                <th class="${rowClass}">${element.company_data.company_name}</th>
                <th class="${rowClass}">${element.course_data.course_name}</th>
                <th class="${rowClass}">${'#' + String(element.event_data.id).padStart(8,'0')}</th>
                <th class="${rowClass}">${dateToString(element.event_data.start_date)}</th>
                <th class="${rowClass}">${dateToString(element.event_data.end_date)}</th>
                <th class="${rowClass}">${element.last_name + ', ' + element.first_name}</th>
                <th class="${rowClass}">${element.dni}</th>
                <th class="${rowClass}">
                    <div class="thWithIcon">
                        <div class="${quotationColor}">${quotationNumber}</div>
                        ${(quotationNumber != 'S/C' && quotationNumber != 'Pendiente') ? '<div><i class="fa-solid fa-magnifying-glass-plus thIcon" id="view_' + element.id + '"></i></div>' : ''}
                    </div>
                </th>
                <th class="${rowClass}">${downloadPO}</th>
            </tr>
        `;
    }).join('');

    bodyEventsHistory.innerHTML = html;

    quotationsHistoryEventListeners(dataToPrint)
    eventsHistoryLoader.style.display = 'none';
}

async function quotationsHistoryEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const download = document.getElementById('download_' + element.id)
        const view = document.getElementById('view_' + element.id)

        //download order
        if (download) {
            download.addEventListener('click',async()=>{
                const fileUrl = '/files/purchaseOrders/' + element.quotation_data.quotation.quotations_purchase_orders.file_name
                const link = document.createElement('a')
                link.href = fileUrl
                link.download = element.quotation_data.quotation.quotations_purchase_orders.file_name
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        }

        //view
        if (view) {
            view.addEventListener('click',async()=>{

                quotationsGlobals.editFrom = 'history'
                quotationsTableData.style.right = '12%'
                
                cqppMainTitle.innerText = element.company_data.company_name
                cqppSubtitle.innerText = 'Cotización #' + String(element.quotation_data.quotation.quotation_number).padStart(6,'0')
                
                completeQuotationStatus(element.quotation_data.quotation.quotations_status.status,element.quotation_data.id_quotations_status)
                
                cqppError2.style.display = 'none'
    
                let quotationDetails = element.quotation_data.quotation.quotations_details

                quotationDetails.sort((a, b) => a.type - b.type)
    
                printTableQuotation(quotationDetails)
                cqpp.style.display = 'block'
            })
        }        
        
        
        
    })
}



export {printEventsHistory}