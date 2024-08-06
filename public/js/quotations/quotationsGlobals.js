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
    eventsToQuote:[],
    linesToQuote:[],
    companyData:{}
}

export default qg