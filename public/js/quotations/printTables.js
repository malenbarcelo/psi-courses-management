import qg from "./qGlobals.js"

async function printTableQuotation(dataToPrint) {

    bodyQuotations.innerHTML = ''
    let counter = 0

    let html = ''

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        const quantity = element.quantity == null ? '' : element.quantity
        const unit_price = element.unit_price == null ? '' : element.unit_price
        const discount = element.discount == null ? '' : element.discount
        const subtotal = element.subtotal == null ? '' : element.subtotal
        const total = element.total == null ? '' : element.total
        
        html += `
            <tr>
                <th class="${rowClass}">${element.description}</th>
                <th class="${rowClass}">${quantity}</th>
                <th class="${rowClass}">${unit_price}</th>
                <th class="${rowClass}">${subtotal}</th>
                <th class="${rowClass}">${discount}</th>
                <th class="${rowClass}">${total}</th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
            </tr>        `
        
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

            qg.elementToEdit = element
            elppTitle.innerText = element.description
            elppQuantity.value = element.quantity
            elppPrice.value = element.unit_price
            elppSubtotal.value = element.subtotal
            elppDiscount.value = element.discount
            elppTotal.value = element.total

            elpp.style.display = 'block'
            
        })
    })
}

function updateQuotationData(dataToPrint) {

    let subtotal = 0    

    dataToPrint.forEach(element => {
        subtotal += element.subtotal
    })


    qg.quotationData.subtotal = subtotal
    qg.quotationData.total = subtotal * (1 - qg.quotationData.discount)

    cqppSubtotal.innerText = qg.formatter.format(subtotal)
    cqppTotal.innerText = qg.formatter.format(subtotal * (1 - qg.quotationData.discount))
    cqppDiscount.innerText = qg.quotationData.discount * 100
    
}





export {printTableQuotation}