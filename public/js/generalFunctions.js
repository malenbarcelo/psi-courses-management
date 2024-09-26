import { dominio } from "./dominio.js"
import g from "./globals.js"

function dateToString(date) {

    const dateWithoutTime = date.split('T')[0]
    const dateAsArray = dateWithoutTime.split('-')

    const year = dateAsArray[0]
    const month = dateAsArray[1]
    const day = dateAsArray[2]
    
    const stringDate = day + '/' + month + '/' + year

    return stringDate    
}

function showOkPopup(popupToShow) {

    popupToShow.style.display = 'block'

    //hide okPopup after one second
    setTimeout(function() {
        popupToShow.style.display = 'none'
    }, 2000)
    
}

async function applyPredictElement(elementsToPredict) {

    for (let i = 0; i < elementsToPredict.length; i++) {
        const input = elementsToPredict[i].input
        const list = elementsToPredict[i].list
        const apiUrl = elementsToPredict[i].apiUrl
        const name = elementsToPredict[i].name
        const elementName = elementsToPredict[i].elementName

        input.addEventListener("input", async(e) => {
            predictElements(input,list,apiUrl,name,elementName)
        })

        input.addEventListener("keydown", async(e) => {
            selectFocusedElement(e,input,list,elementName)
        })
    }
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
                    const event = new Event('change')
                    input.dispatchEvent(event)
                    list.style.display = 'none'
                })
            }
        }

    }else{
        list.style.display = 'none'
        list.innerHTML = ''
    }
}

function selectWithClick(e,dataToSelect) {
    let clickPredictedElement = false
    let inputToClick
    dataToSelect.forEach(element => {
        const input = element.input
        const name = element.name        
        const findeElement = g.predictedElements.filter(p => p[name] == e.target.innerText)
        if (findeElement.length > 0) {
            input.value = e.target.innerText
            clickPredictedElement = true
            inputToClick = input
        }
    })
    return {clickPredictedElement,inputToClick}
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

        if (list.style.display == 'block') {
            if (g.productFocused == -1) {
                input.value = ''
            }else{
                input.value = g.elementToFocus.innerText
            }
            
            list.style.display = 'none'
        }

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

function showTableInfo(tableIcons,top,width) {
    tableIcons.forEach(element => {
        const info = document.getElementById(element.icon.id.replace('Icon','Info'))
        if (info) {
            element.icon.addEventListener("mouseover", async(e) => {
                info.style.top = top + 'px'
                info.style.right = element.right
                
                info.style.width = width + 'px'
                info.style.display = 'block'
            })
            element.icon.addEventListener("mouseout", async(e) => {
                info.style.display = 'none'
            })
        }
    })
    
}

function clearInputs(inputs) {
    inputs.forEach(input => {
        if (input) {
            input.value = ''
        }
    })
}

function uncheckInputs(inputs) {
    inputs.forEach(input => {
        if (input) {
            input.checked = false
        }
    })
}

function isValid(inputs) {
    inputs.forEach(input => {
        if (input) {
            const label = document.getElementById(input.id + 'Label')
            const error = document.getElementById(input.id + 'Error')
            input.classList.remove('invalidInput')
            if (label) {
                label.classList.remove('invalidLabel')
            }
            
            if (error) {
                error.style.display = 'none'
            }   
        }
    })    
}

function isInvalid(inputs) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.add('invalidInput')
        if (label) {
            label.classList.add('invalidLabel')
        }
        if (error) {
            error.style.display = 'block'
        }
        
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

export {dateToString,showOkPopup,predictElements,selectFocusedElement,closePopupsEventListeners,acceptWithEnter,showTableInfo,clearInputs, isValid, isInvalid,inputsValidation,emailValidation,uncheckInputs,applyPredictElement}