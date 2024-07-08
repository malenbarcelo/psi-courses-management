
let ug = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    users:[],
    usersFiltered:[],
    companies:[],
    usersCategories:[],
    idUserToBlock:0,
    idUserToRestore:0,
    idUserToEdit:0,
    psiCategoriesIds:[2,3],
    customersCategoriesIds:[4],
    elementsToPredict:[
        {
            input:filterLastName,
            list:filterLastNameUl,
            apiUrl: 'apis/users/predict-last-names/',
            dataToPrint: 'last_name',
            elementName: 'lastName'
        },
        {
            input:filterFirstName,
            list:filterFirstNameUl,
            apiUrl: 'apis/users/predict-first-names/',
            dataToPrint: 'first_name',
            elementName: 'firstName'
        },
        {
            input:filterEmail,
            list:filterEmailUl,
            apiUrl: 'apis/users/predict-emails/',
            dataToPrint: 'email',
            elementName: 'email'
        }
    ]
}

export default ug