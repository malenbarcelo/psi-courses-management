import { dominio } from "../dominio.js"
import { showOkPopup,isValid } from "../generalFunctions.js"
import { completeNextEventsGlobals, clickCancel } from "./functions.js"
import eg from "./globals.js"

async function printCompanies(dataToPrint,eventData) {

    companiesLoader.style.display = 'block'
    
    bodyCompanies.innerHTML = ''
    let counter = 0
    let html = '';
    dataToPrint.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
        const companyName = eg.companies.filter(c => c.id == element)[0].company_name
        const reservations = eg.reservationsPerEventCompany.filter(r => r.id_events == eg.idEvents && r.id_companies == element)[0].total_quota_reservations
        const assignations = eg.eventStudents.filter( es => es.id_events == eg.idEvents && es.id_companies == element).length
        const toAssign = reservations - assignations
        
        html += `
            <tr>
                <th class="${rowClass}">${companyName}</th>
                <th class="${rowClass}">${reservations}</th>
                <th class="${rowClass}">${assignations}</th>
                <th class="${rowClass}">${toAssign}</th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element}"></i></th>
                <th class="${rowClass}"><i class="fa-regular fa-circle-xmark allowedIcon" id="cancel_${element}"></i></th>
            </tr>
        `;
        counter += 1;
    });

    bodyCompanies.innerHTML += html;

    companiesEventListeners(dataToPrint)

    companiesLoader.style.display = 'none'
}

async function companiesEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element)
        const cancel = document.getElementById('cancel_' + element)
        
        //edit reservations
        edit.addEventListener('click',async()=>{

            const companyEvents = await (await fetch(dominio + 'apis/courses-events/company-next-events/' + element)).json()
            eg.companyEventData = companyEvents.filter(ce => ce.id == eg.idEvents)[0]

            rqppMainTitle.innerText = 'EDITAR RESERVA'
            rqppQuota.value = eg.companyEventData.companyReservations
            rqppAccept.innerText = 'Editar'
            eg.editReservationType = 'edit'

            eg.idQuoteToCancel = 0
            crppAlertText.innerText = ''
            crppAlert.style.display = 'none'
            
            eg.idCompanyToEdit = element
            eg.editReservationFrom = 'administrator'
            isValid([rqppQuota])
            rqppDivCompany.style.display = 'none'
            rqpp.style.display = 'block'

        })

        //cancel reservations
        cancel.addEventListener('click',async()=>{

            const companyEvents = await (await fetch(dominio + 'apis/courses-events/company-events/' + element)).json()
            const companyEventData = companyEvents.filter(ce => ce.id == eg.idEvents)[0]
            eg.idCompanyToEdit = element
            eg.editReservationFrom = 'administrator'

            completeNextEventsGlobals(companyEventData)
            clickCancel(companyEventData)
            
        })


    })
}

export {printCompanies}