
let cg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    courses:[],
    companies:[],
    companiesPerCourse:[],
    studentsPerCourse:[],
    coursesFiltered:[],
    newEventCourseId: 0,
    newEventInvitedCompanies: [],
    action:'',
    courseToEditName:'',
    courseToEditId:0
}

export default cg