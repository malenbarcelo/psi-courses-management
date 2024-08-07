import qg from "./quotationsGlobals.js"

async function printTableQuotation(dataToPrint) {

    bodyQuotations.innerHTML = ''
    let counter = 0

    let html = ''

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        html += `
            <tr>
                <th class="${rowClass}">${element.description}</th>
                <th class="${rowClass}">${element.quantity}</th>
                <th class="${rowClass}"></th>
                <th class="${rowClass}"></th>
                <th class="${rowClass}"></th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
            </tr>
        `
        
        counter += 1
    })

    bodyQuotations.innerHTML += html

    tableQuotationEventListeners(dataToPrint)
    updateQuotationData(dataToPrint)
    
}

async function tableQuotationEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const deleteLine = document.getElementById('delete_' + element.id)
        const edit = document.getElementById('edit_' + element.id)

        //delete line
        deleteLine.addEventListener('click',async()=>{
            qg.elementsToQuote = qg.elementsToQuote.filter(eq => eq.id != element.id)
            printTableQuotation(qg.elementsToQuote)
            
        })

        //edit
        edit.addEventListener('click',async()=>{
            elppTitle.innerText = element.description
            elppQuantity.innerText = element.quantity
            elppPrice.innerText = element.unit_price
            elppDiscount.innerText = element.discount
            elppTotal.innerText = element.unit_price

            elpp.style.display = 'block'
            
        })
    })
}

function updateQuotationData(dataToPrint) {

    let subtotal = 0    

    dataToPrint.forEach(element => {
        subtotal += element.extended_price
    })

    qg.quotationData.subtotal = subtotal
    qg.quotationData.total = subtotal * (1 - qg.quotationData.discount)

    cqppSubtotal.innerText = qg.formatter.format(subtotal)
    cqppTotal.innerText = qg.formatter.format(subtotal * (1 - qg.quotationData.discount))
    cqppDiscount.innerText = qg.quotationData.discount * 100
    
}





export {printTableQuotation}