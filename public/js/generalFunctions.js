import { dominio } from "./dominio.js"
import g from "./globals.js"


function dateToString(date) {

    const dateAsArray = date.split('-')

    const year = dateAsArray[0]
    const month = dateAsArray[1]
    const day = dateAsArray[2]
    
    const stringDate = day + '-' + month + '-' + year

    return stringDate    
}

function showOkPopup(popupToShow) {

    popupToShow.style.display = 'block'

    //hide okPopup after one second
    setTimeout(function() {
        popupToShow.style.display = 'none'
    }, 1500)
    
}

async function predictElements(input,list,apiUrl,dataToPrint,elementName) {
    if (input.value.length >= 3) {

        let id = 0
        
        const string = input.value.toLowerCase()
        g.predictedElements = await (await fetch(dominio + apiUrl + string)).json()

        list.innerHTML = ''

        g.predictedElements.forEach(element => {
            list.innerHTML += '<li class="liPredictedElements" id="' + elementName + '_'+ id +'">' + element[dataToPrint] + '</li>'
            id += 1
        })

        g.focusedElement = -1

        if (g.predictedElements.length > 0) {
            list.style.display = 'block'
            
            for (let i = 0; i < g.predictedElements.length; i++) {

                const element = document.getElementById(elementName + '_' + i)
                
                element.addEventListener("mouseover", async() => {

                    //unfocus all elements
                    for (let j = 0; j < g.predictedElements.length; j++) {
                        const element = document.getElementById(elementName + '_' + j)
                        if (j == i) {
                            element.classList.add('predictedElementFocused')
                        }else{
                            element.classList.remove('predictedElementFocused')
                        }                            
                    }
                })
                
                element.addEventListener("click", async() => {
                    input.value = element.innerText
                    list.style.display = 'none'                      
                })
            }
        }

    }else{
        list.style.display = 'none'
        list.innerHTML = ''
    }
}

function selectFocusedElement(e,input,list,elementName) {
    if (e.key === 'ArrowDown' && g.predictedElements.length > 0) {
            
        g.focusedElement = (g.focusedElement == g.predictedElements.length-1) ? g.focusedElement : (g.focusedElement + 1)            
        
        g.elementToFocus = document.getElementById(elementName + '_' + g.focusedElement)            
        g.elementToFocus.classList.add('predictedElementFocused')
        g.elementToFocus.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })

        if (g.focusedElement > 0) {
            g.elementToUnfocus = document.getElementById(elementName + '_' + (g.focusedElement-1))
            g.elementToUnfocus.classList.remove('predictedElementFocused')                
        }

    }else if(e.key === 'ArrowUp'){

        g.focusedElement = (g.focusedElement == 0) ? g.focusedElement : (g.focusedElement - 1)

        g.elementToFocus = document.getElementById(elementName + '_' + g.focusedElement)            
        g.elementToFocus.classList.add('predictedElementFocused')
        g.elementToFocus.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })

        if (g.focusedElement != -1) {
            g.elementToUnfocus = document.getElementById(elementName + '_' + (g.focusedElement + 1))
            g.elementToUnfocus.classList.remove('predictedElementFocused')                
        }
        
    }else if(e.key === 'Enter'){

        if (g.productFocused == -1) {
            input.value = ''
        }else{
            input.value = g.elementToFocus.innerText
        }
        
        list.style.display = 'none'
    }else if(e.key === 'Escape'){
        g.focusedElement = -1
        input.value = ''
        list.style.display = 'none'

    }
}

function closePopupsEventListeners(closePopups) {
    closePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'
        })
    })
}

function acceptWithEnter(input,button) {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            button.click()
        }
    })
}

function showTableInfo(tableIcons,top,left,width) {
    tableIcons.forEach(element => {
        const info = document.getElementById(element.id.replace('Icon','Info'))
        element.addEventListener("mouseover", async(e) => {
            const mouseX = e.clientX
            info.style.top = top + '%'
            info.style.left = (mouseX - left) + 'px'
            info.style.width = width + 'px'
            info.style.display = 'block'
        })
        element.addEventListener("mouseout", async(e) => {
            info.style.display = 'none'
        })
    })
    
}

function clearInputs(inputs) {
    inputs.forEach(input => {
        input.value = ''
    })
}

function isValid(inputs) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.remove('invalidInput')
        label.classList.remove('invalidLabel')
        error.style.display = 'none'
    })    
}

function isInvalid(inputs) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.add('invalidInput')
        label.classList.add('invalidLabel')
        error.style.display = 'block'
    })    
}

function inputsValidation(inputs) {
    let errors = 0
    inputs.forEach(input => {
        if (input.value == '') {
            isInvalid([input])
                errors += 1
        }else{
            isValid([input])
        }
    })
    return errors
}

function emailValidation(email) {
    let emailErrors = 0
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
        emailErrors += 1
    }

    return emailErrors
    
}



export {dateToString,showOkPopup,predictElements,selectFocusedElement,closePopupsEventListeners,acceptWithEnter,showTableInfo,clearInputs, isValid, isInvalid,inputsValidation,emailValidation}