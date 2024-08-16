let qg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    idCompanies:0,
    idUsersCategories:0,
    quotations:[],
    quotationsFiltered:[],
    quotationsData:[],
    reservationsPerCompany:[],
    elementToEdit:{},
    selectedElements:[],
    elementsToQuote:[],
    quotationData:{
        subtotal:0,
        discount:0,
        total:0
    },
    quotationNumber:'',
    companyData:{},
    editFrom:'create',
    idQuotationToEdit:0,
    elementsToCancel:[]
}

export default qg