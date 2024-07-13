
let cg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    courses:[],
    companies:[],
    coursesFiltered:[],
    newEventCourseId: 0,
    newEventInvitedCompanies: [],

}

export default cg