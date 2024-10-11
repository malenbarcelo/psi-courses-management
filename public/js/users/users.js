import { dominio } from "../dominio.js"
import ug from "./globals.js"
import { printUsers,filterUsers } from "./functions.js"
import { clearInputs, isValid, isInvalid,closePopupsEventListeners,acceptWithEnter,predictElements,selectFocusedElement,showTableInfo,showOkPopup, inputsValidation,emailValidation } from "../generalFunctions.js"

//popups event listeners
import { ccppEventListeners} from "./usersCCPP.js"
import { vcppEventListeners,vcppPrintTable} from "./usersVCPP.js"

window.addEventListener('load',async()=>{

    //get data and complete globals    
    usersLoader.style.display = 'block'

    ug.companies = await (await fetch(dominio + 'apis/users/companies')).json()
    ug.users = await (await fetch(dominio + 'apis/users/get-users')).json()
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
    const tableIcons = [
        {
            icon:euppIcon,
            right:'17.5%'
        },
        {
            icon:rpppIcon,
            right:'13.5%'
        }
        ,
        {
            icon:duppIcon,
            right:'9.5%'
        }
    ]

    showTableInfo(tableIcons,310,150)

    //close popups
    const closePopups = [cuppClose,cuppCancel,ccppClose,ccppCancel,euppClose,euppCancel,rpppClose,rpppCancel,buppClose,buppCancel,vcppClose,vcppCancel,ecppClose,ecppCancel,bcppClose,bcppCancel]
    closePopupsEventListeners(closePopups)

    //create company
    createCompany.addEventListener("click", async() => {
        vcppPrintTable(ug.companies)        
        vcpp.style.display = 'block'
    })

    //create user
    DGAcreateUser.addEventListener("click", async() => {
        const inputs = [cuppCompany,cuppCategory,cuppLastName,cuppFirstName,cuppEmail]
        clearInputs(inputs)
        isValid(inputs)
        cuppCategory.innerHTML = '<option value=""></option>'
        cupp.style.display = 'block'
    })

    //CREATE COMPANY POPUP EVENT LISTENERS (ccpp)
    ccppEventListeners()

    //VIEW COMPANIES POPUP EVENT LISTENERS (vcpp)
    vcppEventListeners()

    cuppCreateCompany.addEventListener("click", async() => {
        clearInputs([ccppCompany])
        isValid([ccppCompany])
        ccpp.classList.remove('popup2')
        ccpp.classList.add('popup')
        ug.createCompanyFrom = 'cupp'
        ccpp.style.display = 'block'
    })

    cuppCompany.addEventListener("change", async() => {
        
        //complete input select category
        cuppCategory.innerHTML = '<option value=""></option>'

        if (cuppCompany.value != '') {
            const categoriesIds = cuppCompany.value == 36 ? ug.psiCategoriesIds : ug.customersCategoriesIds
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
            bodyUsers.innerHTML = ''
            usersLoader.style.display = 'block'
            cupp.style.display = 'none'
            showOkPopup(cuppOk)
            e.target.form.submit()
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

            ug.users = await (await fetch(dominio + 'apis/users/get-users')).json()
            ug.usersFiltered = ug.users
            printUsers(ug.usersFiltered)
            eupp.style.display = 'none'
            showOkPopup(euppOk)
            
        }
        
        
    })

    //accept restore password
    rpppAccept.addEventListener("click", async() => {

        const findUser = ug.users.filter(u => u.id  == ug.idUserToRestore)[0]
        
        const data = findUser

        usersLoader2.style.display = 'block'

        await fetch(dominio + 'apis/users/restore-password',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        printUsers(ug.usersFiltered)
        rppp.style.display = 'none'

        usersLoader2.style.display = 'none'

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

        ug.users = await (await fetch(dominio + 'apis/users/get-users')).json()
        ug.usersFiltered = ug.users
        printUsers(ug.usersFiltered)
        bupp.style.display = 'none'
        showOkPopup(buppOk)
    })

    

    
    

})