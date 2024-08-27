import qg from "./qGlobals.js"
import quotationsGlobals from "../quotations/qGlobals.js"
import { dateToString } from "../generalFunctions.js"
import { printTableQuotation } from "../quotations/printTables.js"
import { completeQuotationStatus } from "../quotations/functions.js"

async function printTableQuotations(dataToPrint) {

    quotesHistoryLoader.style.display = 'block';

    bodyQuotesHistory.innerHTML = '';

    let html = dataToPrint.map((element, index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
        const quotationNumber = '#' + String(element.quotation_number).padStart(6, '0');

        return `
            <tr>
                <th class="${rowClass}">${quotationNumber}</th>
                <th class="${rowClass}">${dateToString(element.created_at)}</th>
                <th class="${rowClass}">${element.quotations_companies.company_name}</th>
                <th class="${rowClass}">${qg.formatter.format(element.total)}</th>
                <th class="${rowClass}">${element.quotations_status.status}</th>
                <th class="${rowClass}">
                    <i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="view_${element.id}"></i>
                </th>                
                <th class="${rowClass}">
                    ${element.quotations_purchase_orders != null 
                        ? `<i class="fa-regular fa-file-pdf allowedIcon" id="download_${element.id}"></i>` 
                        : ''}
                </th>
            </tr>
        `;
    }).join('');

    bodyQuotesHistory.innerHTML = html;

    quotationsHistoryEventListeners(dataToPrint)
    quotesHistoryLoader.style.display = 'none';
}

async function quotationsHistoryEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const download = document.getElementById('download_' + element.id)
        const view = document.getElementById('view_' + element.id)

        //download order
        if (download) {
            download.addEventListener('click',async()=>{
                console.log(element)
                const fileUrl = '/files/purchaseOrders/' + element.quotations_purchase_orders.file_name
                const link = document.createElement('a')
                link.href = fileUrl
                link.download = element.quotations_purchase_orders.file_name
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        }

        //view        
        view.addEventListener('click',async()=>{

            quotationsGlobals.editFrom = 'history'
            quotationsTableData.style.right = '12%'
            
            cqppMainTitle.innerText = element.quotations_companies.company_name
            cqppSubtitle.innerText = 'Cotización #' + String(element.quotation_number).padStart(6,'0')
            cqppError2.style.display = 'none'

            let quotationDetails = element.quotations_details
            quotationDetails.sort((a, b) => a.type - b.type)

            printTableQuotation(quotationDetails)

            completeQuotationStatus(element.quotations_status.status,element.quotations_status.id)

            cqpp.style.display = 'block'
        })
        
        
    })
}



export {printTableQuotations}