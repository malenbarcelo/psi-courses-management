import { dominio } from "../dominio.js"
import ug from "./globals.js"
import { isValid } from "../generalFunctions.js"

async function printUsers(dataToPrint) {

    usersLoader.style.display = 'block'
    
    bodyUsers.innerHTML = ''
    let counter = 0

    //printTable
    dataToPrint.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        //print table
        const line1 = '<th class="' + rowClass + '">' + element.last_name + '</th>'
        const line2 = '<th class="' + rowClass + '">' + element.first_name + '</th>'
        const line3 = '<th class="' + rowClass + '">' + element.email + '</th>'
        const line4 = '<th class="' + rowClass + '">' + element.users_companies.company_name + '</th>'
        const line5 = '<th class="' + rowClass + '">' + element.users_categories.user_category + '</th>'
        const line6 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
        const line7 = '<th class="' + rowClass + '"><i class="fa-solid fa-unlock-keyhole allowedIcon" id="restore_' + element.id + '"></i></th>'
        const line8 = '<th class="' + rowClass + '"><i class="fa-solid fa-ban allowedIcon" id="block_' + element.id + '"></i></th>'

        bodyUsers.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + '</tr>'

        counter += 1

    })

    addUsersEventListeners(dataToPrint)

    usersLoader.style.display = 'none'
}

function addUsersEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const restore = document.getElementById('restore_' + element.id)
        const block = document.getElementById('block_' + element.id)

        //edit user        
        edit.addEventListener('click',async()=>{
            ug.idUserToEdit = element.id
            euppCompany.value = element.users_companies.company_name
            euppLastName.value = element.last_name
            euppFirstName.value = element.first_name
            euppEmail.value = element.email

            //clear inputs
            const inputs = [euppLastName,euppFirstName]
            isValid(inputs)
            
            //complete input select category
            euppCategory.innerHTML = ''
            const categoriesIds = element.id_companies == 1 ? ug.psiCategoriesIds : ug.customersCategoriesIds
            categoriesIds.forEach(category => {
                const categoryName = ug.usersCategories.filter(uc => uc.id == category)[0].user_category
                const selected = element.id_users_categories == category ? 'selected' : ''
                euppCategory.innerHTML += '<option value="' + category + '" ' + selected + '>' + categoryName + '</option>'
                
            })
            
            eupp.style.display = 'block'
        })

        //restore password        
        restore.addEventListener('click',async()=>{
            ug.idUserToRestore = element.id
            rpppQuestion.innerHTML = '¿Confirma que desea restablecer la contraseña del usuario <b>' + element.email + '</b>?'
            rppp.style.display = 'block'
        })

        //block user        
        block.addEventListener('click',async()=>{
            ug.idUserToBlock = element.id
            buppQuestion.innerHTML = '¿Confirma que desea dar de baja al usuario <b>' + element.email + '</b>?'
            bupp.style.display = 'block'
        })

    })

}

function filterUsers() {

    ug.usersFiltered = ug.users

    //company
    ug.usersFiltered = filterCompany.value == '' ? ug.usersFiltered : ug.usersFiltered.filter(u => u.id_companies == filterCompany.value)

    //last name
    ug.usersFiltered = filterLastName.value == '' ? ug.usersFiltered : ug.usersFiltered.filter(u => u.last_name == filterLastName.value)

    //first name
    ug.usersFiltered = filterFirstName.value == '' ? ug.usersFiltered : ug.usersFiltered.filter(u => u.first_name == filterFirstName.value)

    //email
    ug.usersFiltered = filterEmail.value == '' ? ug.usersFiltered : ug.usersFiltered.filter(u => u.email == filterEmail.value)

    //users categories
    ug.usersFiltered = filterCategory.value == '' ? ug.usersFiltered : ug.usersFiltered.filter(u => u.id_users_categories == filterCategory.value)

    

}



export {printUsers,filterUsers}