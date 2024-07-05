import { dominio } from "../dominio.js"
import ug from "./usersGlobals.js"
import { printUsers,filterUsers } from "./usersFunctions.js"
import { clearInputs, isValid, isInvalid,closePopupsEventListeners,acceptWithEnter,predictElements,selectFocusedElement,showTableInfo,showOkPopup } from "../generalFunctions.js"

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
    showTableInfo(tableIcons,40,25,40)

    //close popups
    const closePopups = [euppClose,euppCancel,rpppClose,rpppCancel,buppClose,buppCancel]
    closePopupsEventListeners(closePopups)

    //accept edit user
    euppAccept.addEventListener("click", async() => {

        //validations
        if (userLastName.value == '') {
            isInvalid([userLastName])
        }else{
            isValid([userLastName])
        }

        if (userFirstName.value == '') {
            isInvalid([userFirstName])
        }else{
            isValid([userFirstName])
        }

        if (userLastName.value != '' && userFirstName.value != '') {
            
            const data = {
                id:ug.idUserToEdit,
                last_name: userLastName.value,
                first_name:userFirstName.value,
                id_users_categories:userCategory.value
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