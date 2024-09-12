const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')

function getDateArg(date) {
    
    const fullDateArg = date.toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })

    const dateArgArray = fullDateArg.split(', ')[0].split('/')
    const dateArg = dateArgArray[2] + '-' + dateArgArray[1].padStart(2,'0') + '-' + dateArgArray[0].padStart(2,'0')

    const timeArgArray = fullDateArg.split(', ')[1].split(':')

    const timeArg = timeArgArray[0] + ":" + timeArgArray[1] + ":00"

    return {dateArg,timeArg}
}

function eventDateToArg(date) {

    console.log(date)
    
    const dateArray = date.split('-')
    const dateArg = dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]


    return dateArg
}

function transporterData() {
    const transporterData = nodemailer.createTransport({
        host: 'mail.psi-courses-management.wnpower.host', // Servidor de correo saliente
        port: 465, // Puerto SMTP
        secure: true, // true para puerto 465, false para otros puertos
        auth: {
          user: 'administracion@psi-courses-management.wnpower.host', // Tu nombre de usuario
          pass: 'K918;.JWwlq]' // Tu contraseña
        }
      })

    return transporterData
}

function createPassword() {
    //create password
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomPassword = ''
    for (let i = 0; i < 10; i++) {
        randomPassword += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    const password = bcrypt.hashSync(randomPassword,10)

    return {password, randomPassword}
}


        

module.exports = {getDateArg,transporterData,eventDateToArg,createPassword}
