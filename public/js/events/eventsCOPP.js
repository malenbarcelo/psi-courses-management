import { dominio } from "../dominio.js"
import { isValid } from "../generalFunctions.js"
import eg from "./globals.js"

//COMPANIES POPUP (copp)
async function coppEventListeners() {

    coppNewReservation.addEventListener("click", async() => {
        const companiesToReserve = eg.companies.filter(c => !eg.eventCompanies.includes(c.id))
        rqppCompany.innerHTML = '<option value=""></option>'
        companiesToReserve.forEach(company => {
            rqppCompany.innerHTML += '<option value="' + company.id + '">' + company.company_name + '</option>'            
        })
        
        eg.editReservationType = 'reserve'
        eg.editReservationFrom = 'administrator'
        rqppDivCompany.style.display = 'flex'
        rqppAccept.innerText = 'Reservar'
        rqppMainTitle.innerText = 'RESERVAR CUPO'
        rqppQuota.value = ''
        isValid([rqppCompany,rqppQuota])
        rqpp.style.display = 'block'
    })
}

export {coppEventListeners}