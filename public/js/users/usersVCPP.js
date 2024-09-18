import { dominio } from "../dominio.js"
import ug from "./globals.js"
import { showTableInfo,acceptWithEnter,inputsValidation, showOkPopup,isValid } from "../generalFunctions.js"
import { filterUsers,printUsers } from "./functions.js"

//VIEW COMPANIES POPUP
async function vcppEventListeners() {

    //table info events listeners
    const tableIcons = [
        {
            icon:ecppIcon,
            right:'19.5%'
        },
        {
            icon:dcppIcon,
            right:'10.5%'
        }
    ]

    showTableInfo(tableIcons,57,150)

    //create company
    vcppCreate.addEventListener("click", async() => {
        isValid([ccppCompany])
        ug.createCompanyFrom = 'vcpp' 
        ccpp.style.display = 'block'
    })

    //edit company accept
    ecppAccept.addEventListener("click", async() => {        
        
        //general validations
        let errors = inputsValidation([ecppCompany])

        //existing company validation
        const findCompany = ug.companies.filter(c => c.company_name == ecppCompany.value)
        
        if (findCompany.length > 0 && findCompany[0].company_name != ug.companyToEdit.company_name) {
            
            ecppCompany.classList.add('invalidInput')
            ecppCompanyLabel.classList.add('invalidLabel')
            ecppCompanyExistingError.innerHTML = 'La companía ' + ecppCompany.value + ' ya existe'
            ecppCompanyExistingError.style.display = 'block'
            errors += 1
        }else{
            ecppCompanyExistingError.style.display = 'none'
        }

        if (errors == 0) {
            const data = {
                idCompany: ug.companyToEdit.id,
                companyName: ecppCompany.value
            }

            await fetch(dominio + 'apis/users/companies/edit-company',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            ug.companies = await (await fetch(dominio + 'apis/users/companies')).json()

            vcppPrintTable(ug.companies)

            //change filterCompany
            filterCompany.innerHTML = '<option value=""></option>'
            ug.companies.forEach(company => {
                filterCompany.innerHTML += '<option value="' + company.id + '">' + company.company_name + '</option>'
                
            })

            ecpp.style.display = 'none'

            showOkPopup(ecppOk)
            
        }
    })

    acceptWithEnter(ecppCompany,ecppAccept)

    //bloc company accept
    bcppAccept.addEventListener("click", async() => {        
        
        const data = {idCompany:ug.companyToEdit.id}

        await fetch(dominio + 'apis/users/block-company',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //update companies
        ug.companies = await (await fetch(dominio + 'apis/users/companies')).json()
        vcppPrintTable(ug.companies)

        //update users
        ug.users = await (await fetch(dominio + 'apis/users/get-users')).json()
        ug.usersFiltered = ug.users
        filterUsers()
        printUsers(ug.usersFiltered)

        //update selects
        //change cuppCompany
        cuppCompany.innerHTML = '<option value=""></option>'         
        ug.companies.forEach(company => {
            cuppCompany.innerHTML += '<option value="' + company.id + '">' + company.company_name + '</option>'                
        })

        //change filterCompany
        filterCompany.innerHTML = '<option value=""></option>'
        ug.companies.forEach(company => {
            filterCompany.innerHTML += '<option value="' + company.id + '">' + company.company_name + '</option>'            
        })

        bcpp.style.display = 'none'

        showOkPopup(bcppOk)

    })
}

async function vcppPrintTable(dataToPrint) {
    vcppLoader.style.display = 'block'
    vcppBody.innerHTML = ''
    let html = dataToPrint.map((element, index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'        

        return `
            <tr>
                <th class="${rowClass}">${element.company_name}</th>
                <th class="${rowClass}">${element.companies_users.length}</th>
                <th class="${rowClass}">
                    <i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i>
                </th>
                <th class="${rowClass}">
                    <i class="fa-regular fa-trash-can allowedIcon" id="block_${element.id}"></i>
                </th>
            </tr>
        `
    }).join('')
    vcppBody.innerHTML = html
    vcppTableEventListeners(dataToPrint)
    vcppLoader.style.display = 'none'
}

function vcppTableEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const block = document.getElementById('block_' + element.id)

        //edit company       
        edit.addEventListener('click',async()=>{
            ug.companyToEdit = element            
            ecppCompany.value = element.company_name
            isValid([ecppCompany])
            ecpp.style.display = 'block'
        })

        //block company        
        block.addEventListener('click',async()=>{
            ug.companyToEdit = element
            
            //findout if company has events reservations
            let companyNextEvents = await (await fetch(dominio + 'apis/courses-events/company-next-events/' + ug.companyToEdit.id)).json()
            companyNextEvents = companyNextEvents.filter( ne => ne.companyReservations > 0)

            if (companyNextEvents.length > 0) {
                showOkPopup(bcppError)
                
            }else{
                bcppText.innerHTML = 'Si da de baja a la companía <b>' + element.company_name + '</b> se bloquearán todos los usuarios de la misma.'
                bcpp.style.display = 'block'
            }
        })

    })

}

export {vcppEventListeners,vcppPrintTable}