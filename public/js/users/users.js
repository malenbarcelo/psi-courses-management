import { dominio } from "../dominio.js"
import ug from "./usersGlobals.js"
import { printUsers,filterUsers } from "./usersFunctions.js"
import { clearInputs, isValid, isInvalid,closePopupsEventListeners,acceptWithEnter,predictElements,selectFocusedElement,showTableInfo,showOkPopup, inputsValidation,emailValidation } from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    //get data and complete globals    
    usersLoader.style.display = 'block'
    ug.users = await (await fetch(dominio + 'apis/users')).json()
    ug.companies = await (await fetch(dominio + 'apis/companies')).json()
    ug.usersCategories = await (await fetch(dominio + 'apis/users-categories')).json()
    ug.usersFiltered = ug.users
    usersLoader.style.display = 'none'

    //print table
    printUsers(ug.usersFiltered)

    //predict elements
    ug.elementsToPredict.forEach(element => {
        
        const input = element.input
        const list = element.list
        const apiUrl = element.apiUrl
        const dataToPrint = element.dataToPrint
        const elementName = element.elementName

        input.addEventListener("input", async(e) => {            
            predictElements(input,list,apiUrl,dataToPrint,elementName)
        })
        
        input.addEventListener("keydown", async(e) => {
            selectFocusedElement(e,input,list,elementName)
        })
    })

    //filters event listeners
    const filters = [filterCompany,filterLastName,filterFirstName,filterEmail,filterCategory]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterUsers()
            printUsers(ug.usersFiltered)
        })
    })

    //unfilter event listener
    unfilterUsers.addEventListener("click", async() => {
        clearInputs(filters)
        ug.usersFiltered = ug.users
        printUsers(ug.usersFiltered)
    })

    //table info events listeners
    const tableIcons = [euppIcon,rpppIcon,duppIcon]
    showTableInfo(tableIcons,41,25,40)

    //close popups
    const closePopups = [cuppClose,cuppCancel,ccppClose,ccppCancel,euppClose,euppCancel,rpppClose,rpppCancel,buppClose,buppCancel]
    closePopupsEventListeners(closePopups)

    //create user
    DGAcreateUser.addEventListener("click", async() => {
        const inputs = [cuppCompany,cuppCategory,cuppLastName,cuppFirstName,cuppEmail]
        clearInputs(inputs)
        isValid(inputs)
        cuppCategory.innerHTML = '<option value=""></option>'
        cupp.style.display = 'block'
    })

    cuppCreateCompany.addEventListener("click", async() => {
        clearInputs([ccppCompany])
        isValid([ccppCompany])
        ccpp.style.display = 'block'
    })

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

    cuppCompany.addEventListener("change", async() => {
        
        //complete input select category
        cuppCategory.innerHTML = '<option value=""></option>'

        if (cuppCompany.value != '') {
            const categoriesIds = cuppCompany.value == 1 ? ug.psiCategoriesIds : ug.customersCategoriesIds
            categoriesIds.forEach(category => {
                const categoryName = ug.usersCategories.filter(uc => uc.id == category)[0].user_category
                cuppCategory.innerHTML += '<option value="' + category + '">' + categoryName + '</option>'
            })
        }
    })

    cuppAccept.addEventListener("click", async(e) => {

        e.preventDefault()

        //validations
        const inputsToValidate = [cuppCompany,cuppCategory,cuppLastName,cuppFirstName]        
        let errors = inputsValidation(inputsToValidate)

        //email validation
        const emailErrors = emailValidation(cuppEmail.value)
        if (emailErrors != 0) {
            isInvalid([cuppEmail])
            errors += 1
        }else{
            isValid([cuppEmail])
        }

        //existing email validation
        const findEmail= ug.users.filter(u => u.email == cuppEmail.value)
        
        if (findEmail.length > 0) {
            
            cuppEmail.classList.add('invalidInput')
            cuppEmailLabel.classList.add('invalidLabel')
            cuppEmailExistingError.innerHTML = 'El usuario ' + cuppEmail.value + ' ya existe'
            cuppEmailExistingError.style.display = 'block'
            errors += 1
        }else{
            cuppEmailExistingError.style.display = 'none'
        }

        if (errors == 0) {
            cupp.style.display = 'none'
            showOkPopup(cuppOk)
            setTimeout(function() {
                e.target.form.submit()
            }, 1500) 
        }

    })

    //accept edit user
    euppAccept.addEventListener("click", async() => {

        //validations
        const inputsToValidate = [euppLastName,euppFirstName]        
        const errors = inputsValidation(inputsToValidate)

        if (errors == 0) {
            
            const data = {
                id:ug.idUserToEdit,
                last_name: euppLastName.value,
                first_name: euppFirstName.value,
                id_users_categories: euppCategory.value
            }

            await fetch(dominio + 'apis/users/edit-user',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            ug.users = await (await fetch(dominio + 'apis/users')).json()
            ug.usersFiltered = ug.users
            printUsers(ug.usersFiltered)
            eupp.style.display = 'none'
            showOkPopup(euppOk)
            
        }
        
        
    })

    //accept restore password
    rpppAccept.addEventListener("click", async() => {
        
        const data = {idUserToRestore:ug.idUserToRestore}

        await fetch(dominio + 'apis/users/restore-password',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        printUsers(ug.usersFiltered)
        rppp.style.display = 'none'
        showOkPopup(rpppOk)
    })

    //accept block user
    buppAccept.addEventListener("click", async() => {
        
        const data = {idUserToBlock:ug.idUserToBlock}

        await fetch(dominio + 'apis/users/block-user',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        ug.users = await (await fetch(dominio + 'apis/users')).json()
        ug.usersFiltered = ug.users
        printUsers(ug.usersFiltered)
        bupp.style.display = 'none'
        showOkPopup(buppOk)
    })

    

    
    

})