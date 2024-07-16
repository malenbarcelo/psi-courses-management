const nodemailer = require('nodemailer')

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

function sendEmail(subject,body) {
    const transporter = nodemailer.createTransport({
        host: 'mail.multibrand.wnpower.host', // Servidor de correo saliente
        port: 465, // Puerto SMTP
        secure: true, // true para puerto 465, false para otros puertos
        auth: {
          user: 'administracion@multibrand.wnpower.host', //Tu nombre de usuario
          pass: ']p66RdoWHDuE' // Tu contraseña
        }
    })

    const mailOptions = {
        from: 'administracion@multibrand.wnpower.host',
        to: 'barcelomalen@gmail.com',
        subject: subject,
        html: body
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString())
        }
    })
}
        

module.exports = {getDateArg,sendEmail,eventDateToArg}
