import { dominio } from "../dominio.js"
import { closePopupsEventListeners, isInvalid, inputsValidation, emailValidation, isValid, showOkPopup } from "../generalFunctions.js"

window.addEventListener('load',async()=>{

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

        let errors = 0
        
        if (errors == 0) {

            const data = {
                email: fpppEmail.value
            }

            loginLoader.style.display = 'block'

            await fetch(dominio + 'apis/users/restore-password',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

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
        chpppPsw.value = ''
        
        isValid(inputs)
        chppp.style.display = 'block'
    })

    //accept change passwrod
    chpppAccept.addEventListener("click", async() => {

        //validations
        let errors = 0

        //all data completed
        if (chpppEmail.value == '' || chpppPsw.value == '' || chpppNewPsw.value == '' || chpppConfirm.value == '') {
            errors += 1
            chpppEmailError.innerText = 'Debe completar todos los datos'
            chpppPswError.innerText = 'Debe completar todos los datos'
            chpppNewPswError.innerText = 'Debe completar todos los datos'
            chpppConfirmError.innerText = 'Debe completar todos los datos'
            isInvalid([chpppEmail,chpppPsw,chpppNewPsw,chpppConfirm])
        }else{

            const data = {
                email:chpppEmail.value,
                password: chpppPsw.value
            }
    
            const pswValidation = await fetch(dominio + 'apis/users/psw-validation',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
    
            const result = await pswValidation.json()
    
            if (!result) {
                errors += 1
                chpppEmailError.innerText = 'Datos inválidos'
                chpppPswError.innerText = 'Datos inválidos'
                isInvalid([chpppPsw,chpppEmail])
                isValid([chpppNewPsw,chpppConfirm])
            }else{
                isValid([chpppPsw,chpppEmail])
                if (chpppNewPsw.value != chpppConfirm.value) {
                    errors += 1
                    chpppNewPswError.innerText = 'Las contraseñas no coinciden'
                    chpppConfirmError.innerText = 'Las contraseñas no coinciden'
                    isInvalid([chpppNewPsw,chpppConfirm])
                }else{
                    isValid([chpppNewPsw,chpppConfirm])
                }
            }
        }

        if (errors == 0) {
            const data = {
                password: chpppNewPsw.value,
                email: chpppEmail.value
            }

            await fetch(dominio + 'apis/users/change-password',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            chppp.style.display = 'none'
            showOkPopup(chpppOk)
            
        }

    })

})