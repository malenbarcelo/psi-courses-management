import { dominio } from "../dominio.js"
import eg from "./globals.js"

async function printStudents(dataToPrint,loader,body) {

    loader.style.display = 'block'
    
    body.innerHTML = ''
    let counter = 0

    let html = '';
    dataToPrint.forEach(element => {
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
        
        // Construir las filas de la tabla
        if (eg.idUserCategories == 4) {
            html += `
            <tr>
                <th class="${rowClass}">${element.last_name}</th>
                <th class="${rowClass}">${element.first_name}</th>
                <th class="${rowClass}">${element.dni}</th>
                <th class="${rowClass}">${element.art}</th>
                <th class="${rowClass}">si</th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
            </tr>
        `;  
        }else{
            html += `
            <tr>
                <th class="${rowClass}">${element.company_data.company_name}</th>
                <th class="${rowClass}">${element.last_name}</th>
                <th class="${rowClass}">${element.first_name}</th>
                <th class="${rowClass}">${element.dni}</th>
                <th class="${rowClass}">${element.art}</th>
                <th class="${rowClass}">si</th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
            </tr>
            `
        }
        
        
        counter += 1;
    });

    // Insertar todo el HTML en el DOM de una sola vez
    body.innerHTML += html;

    addStudentsEventListeners(dataToPrint)

    loader.style.display = 'none'
}

async function addStudentsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const deleteStudent = document.getElementById('delete_' + element.id)

        //delete students
        deleteStudent.addEventListener('click',async()=>{
            dsppQuestion.innerHTML = '¿Confirma que desea eliminar al alumno <b>' + element.last_name + ' ' + element.first_name + '</b>?'
            eg.idStudentToDelete = element.id
            dspp.style.display = 'block'
        })
        
    })
}

export {printStudents}