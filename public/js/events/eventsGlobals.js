let eg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    idCompanies:0,
    idUserCategories:0,
    events:[],
    eventsFiltered:[],
    companies:[],
    reservationsPerEventCompany:[],
    idEvents:0,
    idCourses:0,    
    eventCourseName:'',
    eventData:{},
    eventStudents:[],
    eventStudentsFiltered:[],
    eventInvitedCompanies:[],
    eventCompanies: [],
    editReservationType:'',
    companyReservations: 0,
    idStudentToDelete:0,
    studentsFrom:''
}

export default eg