let eg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    idCompanies:0,
    idUserCategories:0,
    events:[],
    eventsFiltered:[],
    idEvents:0,
    idCourses:0,    
    eventCourseName:'',
    eventStudents:[],
    editReservationType:'',
    companyReservations: 0,
    idStudentToDelete:0




    // eventAvailableQuota:0,
    // eventCourseName:'',
    // eventCourseId:0,
    // editReservationType:'',
    // companyReservationsQty:0,
    // eventCompanyAssignedStudents:[],
    // eventAssignedStudents:[],
    // idStudentToDelete:0
}

export default eg