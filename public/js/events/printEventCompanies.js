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
        const quotation = eventData.quotations_events_companies.filter(qec => qec.id_companies == element)[0]

        console.log(quotation)

        

        html += `
            <tr>
                <th class="${rowClass}">${companyName}</th>
                <th class="${rowClass}">${reservations}</th>
                <th class="${rowClass}">${assignations}</th>
                <th class="${rowClass}">${toAssign}</th>
                <th class="${rowClass}">${quotation.id_quotations == null ? '-' : "#" + String(quotation.id_quotations).padStart(8,'0')}</th>
                <th class="${rowClass}">${quotation.requires_quotation == 0 ? 'No requiere' : quotation.quotation_status.status }</th>
                
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

            if (eg.companyEventData.quotations_events_companies[0].id_quotations_status == 1) {
                rqppErrorText.innerText = 'No es posible editar reservas con cotizaciones aprobadas.'
                showOkPopup(rqppError)
            }else{
                rqppMainTitle.innerText = 'EDITAR RESERVA'
                rqppQuota.value = eg.companyEventData.companyReservations
                rqppAccept.innerText = 'Editar'
                eg.editReservationType = 'edit'

                if (eg.companyEventData.quotations_events_companies[0].id_quotations_status == 2 || eg.companyEventData.quotations_events_companies[0].id_quotations_status == 3) {
                    crppAlertText.innerHTML = 'El evento posee una cotización en estado: <b>' + eg.companyEventData.quotations_events_companies[0].quotation_status.status + '</b>. Si edita el cupo, la cotización será cancelada en su totalidad.'
                    eg.idQuoteToCancel = eg.companyEventData.quotations_events_companies[0].id_quotation
                    crppAlert.style.display = 'flex'
                }else{
                    eg.idQuoteToCancel = 0
                    crppAlertText.innerText = ''
                    crppAlert.style.display = 'none'
                }

                eg.idCompanies = element
                eg.editReservationFrom = 'administrator'
                isValid([rqppQuota])
                rqpp.style.display = 'block'
            }
        })

        //cancel reservations
        cancel.addEventListener('click',async()=>{

            const companyEvents = await (await fetch(dominio + 'apis/courses-events/company-next-events/' + element)).json()
            const companyEventData = companyEvents.filter(ce => ce.id == eg.idEvents)[0]
            eg.idCompanyToEdit = element
            eg.editReservationFrom = 'administrator'

            completeNextEventsGlobals(companyEventData)
            clickCancel(companyEventData)
            
        })


    })
}

export {printCompanies}