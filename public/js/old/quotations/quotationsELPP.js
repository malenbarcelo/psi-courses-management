import qg from "./qGlobals.js"
import { printTableQuotation } from "./printTables.js"

//EDIT LINE POPUP
async function elppEventListeners() {    
    
    const elppInputs = [elppQuantity,elppPrice, elppDiscount]
    elppInputs.forEach(input => {
        input.addEventListener("change", async() => {
            const quantity = elppQuantity.value == '' ? '' : parseInt(elppQuantity.value)
            const price = elppPrice.value == '' ? '' : parseFloat(elppPrice.value,2)
            const extended_price = (elppQuantity.value == '' || elppPrice.value == '') ? '' : quantity * price
            const discount = elppDiscount.value == '' ? 0 : parseFloat(elppDiscount.value,2)
            const total = (elppQuantity.value == '' || elppPrice.value == '') ? '' : quantity * price * ( 1 - discount/100)

            elppSubtotal.value = extended_price
            elppTotal.value = total            

        })        
    })

    //elpp accept  (edit line popup)
    elppAccept.addEventListener("click", async() => {
        
        //edit element
        const quantity = elppQuantity.value == '' ? null : parseInt(elppQuantity.value)
        const price = elppPrice.value == '' ? '' : parseFloat(elppPrice.value,2)
        const extended_price = (elppQuantity.value == '' || elppPrice.value == '') ? null : quantity * price
        const discount = elppDiscount.value == '' ? 0 : parseFloat(elppDiscount.value,2) / 100
        const total = (elppQuantity.value == '' || elppPrice.value == '') ? null : quantity * price * ( 1 - discount)
        
        qg.elementsToQuote = qg.elementsToQuote.map(item => 
            item.id == qg.elementToEdit.id ? {...item, quantity: quantity, unit_price: price, subtotal:extended_price,discount: discount, total: total} : item
        )

        printTableQuotation(qg.elementsToQuote)

        elpp.style.display = 'none'
    })
}

export {elppEventListeners}