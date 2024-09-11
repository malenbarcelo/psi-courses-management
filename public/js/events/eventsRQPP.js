import { dominio } from "../dominio.js"
import { acceptWithEnter } from "../generalFunctions.js"
import { reserveQuotaValidations, editQuotaValidations } from "./validations.js"
import eg from "./globals.js"

//RESERVET QUOTATION (rqpp)
async function rqppEventListeners() {

    rqppAccept.addEventListener("click", async() => {

        let errors = 0

        if (eg.editReservationType == 'reserve') {
            errors = reserveQuotaValidations()
        }else{
            errors = editQuotaValidations()
        }

        if (errors == 0) {
            if (eg.editReservationType == 'reserve') {
                crppQuestion.innerHTML = '¿Confirma que desea reservar <b>' + rqppQuota.value + '</b> cupos para el curso <b>' + eg.eventCourseName + '</b>?'
            }else{
                crppQuestion.innerHTML = '¿Confirma que desea editar la reserva a <b>' + rqppQuota.value + '</b> cupos para el curso <b>' + eg.eventCourseName + '</b>?'
            }
            
            crpp.style.display = 'block'            
        }
    })
    acceptWithEnter(rqppQuota,rqppAccept)
}

export {rqppEventListeners}