let eg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    idCompanies:0,
    idUserCategories:0,
    events:[],
    eventsFiltered:[],
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
    studentsFrom:'',
    idQuoteToCancel:0,
    idQuoteToReject:0
}

export default eg