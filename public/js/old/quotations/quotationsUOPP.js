import qg from "./qGlobals.js"
import { dominio } from "../dominio.js"

//UPLOAD ORDER POPUP
async function uoppEventListeners() {
    
    uoppAccept.addEventListener("click", async(event) => {

        event.preventDefault()

        //validations
        const file = uoppFile.files[0]

        if (!file) {
            uoppError.innerText = 'Debe subir un archivo'
            uoppError.style.display = 'block'
        }else{
            const fileName = file.name
            const fileExtension = fileName.split('.').pop()
            if (fileExtension != 'pdf') {
                uoppError.innerText = 'El archivo debe ser .pdf'
                uoppError.style.display = 'block'
            }else{
                const formData = new FormData()
                formData.append('uoppFile', file)
                formData.append('id_companies', parseInt(qg.idCompanies))
                formData.append('id_quotations', qg.idQuotationToEdit)
                    
                const response = await fetch(dominio + 'apis/quotations/save-purchase-order', {
                    method: 'POST',
                    body: formData
                })

                cqppFileName.innerText = fileName
                cqppFileCheck.style.display = 'block'
                cqppFileName.style.display = 'block'
                uopp.style.display = 'none'
            }
        }
    })
}

export {uoppEventListeners}