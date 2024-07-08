const bottomHeaderMenu = require('../data/bottomHeaderMenu')
const usersQueries = require('./dbQueries/usersQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const usersCategoriesQueries = require('./dbQueries/usersCategoriesQueries')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')

const usersController = {
    users: async(req,res) => {
        try{

            const idSelectedItem = 3
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

            //return res.send(data)

            await usersQueries.createUser(data, password)

            return res.redirect('/users')

            // const transporter = nodemailer.createTransport({
            //     service: 'schemasim',
            //     auth: {
            //       user: 'notificaciones@schemasim.com',
            //       pass: 'G4Ul/k@4qC'
            //     }
            //   });
            
            // const mailOptions = {
            // from: 'notificaciones@schemasim.com',
            // to: 'barcelomalen@gmail.com',
            // subject: 'hola',
            // text: 'hola estot probando'
            // };
            
            // transporter.sendMail(mailOptions, (error, info) => {
            // if (error) {
            //     return res.status(500).send(error.toString())
            // }
            // Redirigir solo si el envío del correo fue exitoso
            // return res.redirect('/users')
            // })



        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = usersController