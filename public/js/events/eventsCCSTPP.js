import { addStudentAdmValidations } from "./validations.js"
import { printStudents } from "./printEventStudents.js"
import { filterStudents } from "./filters.js"
import eg from "./globals.js"
import { acceptWithEnter,clearInputs, isInvalid, isValid} from "../generalFunctions.js"

//CONFIRM CLOSE STUDENTS POPUP (CCstpp)
async function ccstppEventListeners() {

    ccstppAccept.addEventListener("click", async() => {
        const cstpp = document.getElementById('cstpp')
        const astpp = document.getElementById('astpp')

        if (cstpp) {
            cstpp.style.display = 'none'
        }

        if (astpp) {
            astpp.style.display = 'none'
        }

        ccstpp.style.display = 'none'
        
    })
    
       
}

export {ccstppEventListeners}