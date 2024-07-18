let neg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    companyEvents:[],
    companyEventsFiltered:[],
    companyReservations:[],
    idCompany:0,
    eventId:0,
    eventAvailableQuota:0,
    eventCourseName:'',
    eventCourseId:0,
    editReservationType:'',
    companyReservationsQty:0

}

export default neg