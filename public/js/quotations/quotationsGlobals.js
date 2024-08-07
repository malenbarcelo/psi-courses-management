let qg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
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
    companyData:{}
}

export default qg