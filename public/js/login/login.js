import { dominio } from "../dominio.js"
import { closePopupsEventListeners, isInvalid, inputsValidation, emailValidation, isValid, showOkPopup } from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    let users = await (await fetch(dominio + 'apis/users/get-users')).json()

    //close popups
    const closePopups = [fpppClose,fpppCancel,chpppClose,chpppCancel]
    closePopupsEventListeners(closePopups)

    
    //////////FORGOT PASSWORD
    //click forgot password
    forgotPsw.addEventListener("click", async() => {
        fpppEmail.value = email.value
        isValid([fpppEmail])
        fpppEmailError2.style.display = 'none'
        fppp.style.display = 'block'
    })

    //accept restore password
    fpppAccept.addEventListener("click", async() => {

        const findUser = users.filter(u => u.email == fpppEmail.value)

        fpppEmailError2.style.display = 'none'

        let errors = 0
        
        errors = inputsValidation([fpppEmail])
        
        //email validation
        if (errors == 0) {
            errors = emailValidation(fpppEmail.value)
            if (errors > 0) {
                fpppEmailError2.innerText = 'Email inválido'
                isInvalid([fpppEmail])
                fpppEmailError.style.display = 'none'
                fpppEmailError2.style.display = 'block'
            }
        }

        //find user
        if (errors == 0) {
            if (findUser.length == 0) {
                errors += 1
                fpppEmailError2.innerText = 'Usuario inválido'
                isInvalid([fpppEmail])
                fpppEmailError.style.display = 'none'
                fpppEmailError2.style.display = 'block'
            }
        }

        if (errors == 0) {

            const data = findUser[0]

            loginLoader.style.display = 'block'

            await fetch(dominio + 'apis/users/restore-password',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            users = await (await fetch(dominio + 'apis/users/get-users')).json()
            fppp.style.display = 'none'

            loginLoader.style.display = 'none'
            
            showOkPopup(fpppOk)
            
        }

    })


    //////////CHANGE PASSWORD
    //click change password
    changePsw.addEventListener("click", async() => {
        const inputs = [chpppEmail, chpppPsw, chpppNewPsw, chpppConfirm]
        chpppEmail.value = email.value
        isValid(inputs)
        chppp.style.display = 'block'
    })

    //accept change passwrod
    chpppAccept.addEventListener("click", async() => {

        //validations
        let errors = 0

        const findUser = users.filter(u => u.email == chpppEmail.value)

        //user
        if (findUser.length == 0) {
            errors += 1
            isInvalid([chpppEmail])
        }else{
            isValid([chpppEmail])
        }

        //password
        if (findUser.length > 0) {

            const data = {
                password: chpppPsw.value,
                user: findUser[0]
            }

            const pswValidation = await fetch(dominio + 'apis/users/psw-validation',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const result = await pswValidation.json()

            if (!result) {
                errors += 1
                isInvalid([chpppPsw])
            }else{
                isValid([chpppPsw])
            }            
        }

        //new password
        if (chpppNewPsw.value == '' || chpppConfirm.value == '' || chpppNewPsw.value != chpppConfirm.value) {
            errors += 1
            isInvalid([chpppNewPsw,chpppConfirm])
        }else{
            isValid([chpppNewPsw,chpppConfirm])
        }

        //validation
        if (errors == 0) {

            const data = {
                password: chpppNewPsw.value,
                user: findUser[0]
            }

            await fetch(dominio + 'apis/users/change-password',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            users = await (await fetch(dominio + 'apis/users/get-users')).json()
            chppp.style.display = 'none'
            showOkPopup(chpppOk)
            
        }

    })

})