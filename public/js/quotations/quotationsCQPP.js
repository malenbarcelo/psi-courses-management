import { dominio } from "../dominio.js"
import { showOkPopup } from "../generalFunctions.js"
import qg from "./qGlobals.js"
import { saveQuotation } from "./functions.js"

//CREATE QUOTE POPUP
async function cqppEventListeners() {
    
    //add event
    const cqppAddEvent = document.getElementById('cqppAddEvent')    
    if (cqppAddEvent) {
        cqppAddEvent.addEventListener("click", async() => {
        
            const elementsToQuoteIds = qg.elementsToQuote.map(eq => eq.id)
    
            const eventsToAdd = qg.quotations.filter(q => q.id_companies == qg.companyData.id && !elementsToQuoteIds.includes(q.id) && q.id_quotations == null)
    
            aeppEvent.innerHTML = '<option value=""></option>'
    
            eventsToAdd.forEach(element => {
                const eventToAdd = element.event.events_courses.course_name + ' - Evento #' + String(element.id_events).padStart(8,'0')
                aeppEvent.innerHTML += '<option value="' + element.id + '">' + eventToAdd + '</option>'
                
            })       
            aepp.style.display = 'block'
            
        })        
    }
    
    
    //add new line
    const cqppNewLine = document.getElementById('cqppNewLine')
    if (cqppNewLine) {
        cqppNewLine.addEventListener("click", async() => {
            alppDescription.value = ''
            alpp.style.display = 'block'        
        })
    }

    //upload order
    const cqppUploadOrder = document.getElementById('cqppUploadOrder')
    if (cqppUploadOrder) {
        cqppUploadOrder.addEventListener("click", async() => {
            uoppError.style.display = 'none'
            uopp.style.display = 'block'      
        })
    }

    //change discount
    const cqppEditDiscount = document.getElementById('cqppEditDiscount')
    if (cqppEditDiscount) {
        cqppEditDiscount.addEventListener("click", async() => {
            edppDiscount.value = qg.quotationData.discount * 100
            edpp.style.display = 'block'
        })
    }
    
    //save created quote
    const cqppSave = document.getElementById('cqppSave')
    if (cqppSave) {
        cqppSave.addEventListener("click", async() => {

            //validations
            if (qg.elementsToQuote.length == 0) {
                cqppError2Text.innerText = 'La cotización debe tener al menos una línea'
                cqppError2.style.display = 'flex'
                
            }else{
                saveQuotation('save')            
            }
        })
    }    

    //send quotation
    const cqppSend = document.getElementById('cqppSend')
    if (cqppSend) {
        cqppSend.addEventListener("click", async() => {

            //validations
            if (qg.elementsToQuote.length == 0) {
                cqppError2Text.innerText = 'La cotización debe tener al menos una línea'
                cqppError2.style.display = 'flex'
            }else{
                let errors = 0
                qg.elementsToQuote.forEach(element => {
                    if (element.quantity == null || element.unit_price == null) {
                        errors += 1                    
                    }
                })
                if (errors > 0) {
                    cqppError2Text.innerText = 'Se detetaron campos vacíos. La cotización debe estar completa para ser enviada al cliente.'
                    cqppError2.style.display = 'flex'
                }else{
                    sqppQuestion.innerHTML = '¿Confirma que desea enviar la cotización <b>#' + String(qg.quotationNumber).padStart(6,'0') + '</b> al cliente <b>' + qg.companyData.company_name + '</b> ?'
    
                    sqpp.style.display = 'block'
                }
            }    
        })
    }
    
    //accept quotation
    const cqppAccept = document.getElementById('cqppAccept')
    if (cqppAccept) {
        cqppAccept.addEventListener("click", async() => {

            const file = uoppFile.files[0]

            if (file) {
                aqppQuestion.innerHTML = '¿Confirma que desea aprobar la cotización <b>#' + String(qg.quotationNumber).padStart(6,'0')+'</b>?'                
            }else{
                aqppQuestion.innerHTML = '¿Confirma que desea aprobar la cotización <b>#' + String(qg.quotationNumber).padStart(6,'0')+'</b> sin asociarle orden de compra?'
            }

            aqpp.style.display = 'block'
            
        })
    }

    //refuse quotation
    const cqppRefuse = document.getElementById('cqppRefuse')
    if (cqppRefuse) {
        cqppRefuse.addEventListener("click", async() => {

            reqppQuestion.innerHTML = '¿Confirma que desea rechazar la cotización <b>#' + String(qg.quotationNumber).padStart(6,'0')+'</b>?'                
            
            reqpp.style.display = 'block'
            
        })
    }
}

export {cqppEventListeners}