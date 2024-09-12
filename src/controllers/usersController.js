const bottomHeaderMenu = require('../data/bottomHeaderMenu')
const usersQueries = require('./dbQueries/usersQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const usersCategoriesQueries = require('./dbQueries/usersCategoriesQueries')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')

const usersController = {
    users: async(req,res) => {
        try{

            const idSelectedItem = 4
            const companies = await companiesQueries.companies()
            const usersCategories = await usersCategoriesQueries.usersCategories()
            
            return res.render('users/users',{title:'Usuarios',bottomHeaderMenu,idSelectedItem,companies,usersCategories})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    createUserProcess: async(req,res) => {
        try{

            const data = req.body

            //create password
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let randomPassword = ''
            for (let i = 0; i < 10; i++) {
                randomPassword += characters.charAt(Math.floor(Math.random() * characters.length))
            }

            const password = bcrypt.hashSync(randomPassword,10)

            await usersQueries.createUser(data, password)

            const transporter = nodemailer.createTransport({
                host: 'mail.psi-courses-management.wnpower.host', // Servidor de correo saliente
                port: 465, // Puerto SMTP
                secure: true, // true para puerto 465, false para otros puertos
                auth: {
                  user: 'administracion@psi-courses-management.wnpower.host', // Tu nombre de usuario
                  pass: 'K918;.JWwlq]' // Tu contraseña
                }
              });

            const mailOptions = {
                from: 'administracion@psi-courses-management.wnpower.host',
                to: data.cuppEmail,
                subject: 'PSI Smart Services - Aviso alta de usuario',
                html: `
                <p style="color:black;">PSI Smart Services le informa que ha dado de alta su usuario: </p>
                <p style="color:black;"><strong>Usuario:</strong> ${data.cuppEmail}</p>
                <p style="color:black;"><strong>Contraseña:</strong> ${randomPassword}</p>
                <p>Puede ingresar a https://psi-courses-management.wnpower.host con sus datos para administrar cursos </p>                
                `
            }
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send(error.toString())
                }
            
            return res.redirect('/users')
            
            })

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = usersController