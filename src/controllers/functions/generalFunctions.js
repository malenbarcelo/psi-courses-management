function getDateArg(date) {
    
    const fullDateArg = date.toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })

    const dateArgArray = fullDateArg.split(', ')[0].split('/')
    const dateArg = dateArgArray[2] + '-' + dateArgArray[1].padStart(2,'0') + '-' + dateArgArray[0].padStart(2,'0')

    const timeArgArray = fullDateArg.split(', ')[1].split(':')

    const timeArg = timeArgArray[0] + ":" + timeArgArray[1] + ":00"

    return {dateArg,timeArg}
}
        

module.exports = {getDateArg}
