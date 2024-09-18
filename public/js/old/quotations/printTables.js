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
                <th class="${rowClass}">${qg.formatter.format(unit_price)}</th>
                <th class="${rowClass}">${qg.formatter.format(subtotal)}</th>
                <th class="${rowClass}">${discount * 100}</th>
                <th class="${rowClass}">${qg.formatter.format(total)}</th>
        `
        if (qg.idUsersCategories != 4 && qg.editFrom != 'history') {
            html += `
                    <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
                    <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
                </tr>
            `   
        }else{
            html += `
                </tr>
            `
        }
        
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





export {printTableQuotation}