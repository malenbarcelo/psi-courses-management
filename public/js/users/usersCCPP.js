import { dominio } from "../dominio.js"
import ug from "./usersGlobals.js"
import { acceptWithEnter,inputsValidation } from "../generalFunctions.js"

//CREATE COMPANY POPUP
async function ccppEventListeners() {
    
    //accept
    ccppAccept.addEventListener("click", async() => {        
        //general validations
        let errors = inputsValidation([ccppCompany])

        //existing company validation
        const findCompany = ug.companies.filter(c => c.company_name == ccppCompany.value)
        
        if (findCompany.length > 0) {
            
            ccppCompany.classList.add('invalidInput')
            ccppCompanyLabel.classList.add('invalidLabel')
            ccppCompanyExistingError.innerHTML = 'La companía ' + ccppCompany.value + ' ya existe'
            ccppCompanyExistingError.style.display = 'block'
            errors += 1
        }else{
            ccppCompanyExistingError.style.display = 'none'
        }

        if (errors == 0) {
            
            const data = {company_name:ccppCompany.value}

            await fetch(dominio + 'apis/companies/create-company',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            ug.companies = await (await fetch(dominio + 'apis/companies')).json()

            //change cuppCompany
            cuppCompany.innerHTML = ''
            const newCompany = ug.companies.filter(c => c.company_name == ccppCompany.value)           
            ug.companies.forEach(company => {
                const selected = company.id == newCompany[0].id ? 'selected' : ''
                cuppCompany.innerHTML += '<option value="' + company.id + '" ' + selected + '>' + company.company_name + '</option>'                
            })

            //change cuppCategory
            cuppCategory.innerHTML = '<option value=""></option>'
            const categoriesIds = cuppCompany.value == 1 ? ug.psiCategoriesIds : ug.customersCategoriesIds
            categoriesIds.forEach(category => {
                const categoryName = ug.usersCategories.filter(uc => uc.id == category)[0].user_category
                cuppCategory.innerHTML += '<option value="' + category + '">' + categoryName + '</option>'
                
            })

            ccpp.style.display = 'none'
            
        }
    })

    acceptWithEnter(ccppCompany,ccppAccept)        
     
}

export {ccppEventListeners}