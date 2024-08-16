import qg from "./qGlobals.js"
import { dateToString } from "../generalFunctions.js"

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
                    <i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="edit_${element.id}"></i>
                </th>                
                <th class="${rowClass}">
                    ${element.quotations_purchase_orders != null 
                        ? `<i class="fa-regular fa-file-pdf allowedIcon" id="download_${element.id}"></i>` 
                        : ''}
                </th>
                
                ${qg.idUsersCategories != 4 ? `<th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>` : ''}
            </tr>
        `;
    }).join('');

    bodyQuotesHistory.innerHTML = html;

    //tableQuotationEventListeners(dataToPrint)
    //updateQuotationData(dataToPrint)
    quotesHistoryLoader.style.display = 'none';
}

async function tableQuotationEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const deleteLine = document.getElementById('delete_' + element.id)
        const edit = document.getElementById('edit_' + element.id)

        //delete line
        if (deleteLine) {
            deleteLine.addEventListener('click',async()=>{
                qg.elementsToQuote = qg.elementsToQuote.filter(eq => eq.id != element.id)
                printTableQuotation(qg.elementsToQuote)            
            })
        }        

        //edit
        if (edit) {
            edit.addEventListener('click',async()=>{

                qg.elementToEdit = element
                elppTitle.innerText = element.description
                elppQuantity.value = element.quantity
                elppPrice.value = element.unit_price
                elppSubtotal.value = element.subtotal
                elppDiscount.value = element.discount * 100
                elppTotal.value = element.total    
                elpp.style.display = 'block'
                
            })
        }
        
    })
}

function updateQuotationData(dataToPrint) {

    let subtotal = 0    

    dataToPrint.forEach(element => {
        subtotal += element.total == null ? 0 : parseFloat(element.total,2)
    })

    qg.quotationData.subtotal = subtotal
    qg.quotationData.total = subtotal * (1 - qg.quotationData.discount)
    qg.quotationData.quotation_number = qg.quotationNumber

    cqppSubtotal.innerText = qg.formatter.format(subtotal)
    cqppTotal.innerText = qg.formatter.format(subtotal * (1 - qg.quotationData.discount))
    cqppDiscount.innerText = qg.quotationData.discount * 100
    
}





export {printTableQuotations}