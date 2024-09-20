let eg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    idCompanies:0,
    idUserCategories:0,
    events:[],
    eventsFiltered:[],
    eventData:[],
    companyEventData:[],
    companies:[],
    reservationsPerEventCompany:[],
    idEvents:0,
    idCourses:0,
    idCompanyToEdit:0,    
    eventCourseName:'',
    eventStudents:[],
    eventStudentsFiltered:[],
    eventInvitedCompanies:[],
    eventCompanies: [],
    editReservationType:'',
    editReservationFrom:'',    
    companyReservations: 0,
    idStudentToDelete:0,
    idQuoteToCancel:0,
    idQuoteToReject:0,
    eventCompanyStudents:[]
}

export default eg