const {validationResult} = require('express-validator')
const usersQueries = require('../controllers/dbQueries/usersQueries')

const mainController = {
    login: (req,res) => {
        try{

            req.session.destroy()
            return res.render('login',{title:'Login'})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    loginProcess: async(req,res) => {
        try{

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                console.log(resultValidation)
                return res.render('login',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Login'
                })
            }

            //login
            const userToLogin = await usersQueries.findUserByEmail(req.body.email)

            delete userToLogin.password
            req.session.userLogged = userToLogin

            return res.redirect('/events')

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
    logout: (req,res) => {

        req.session.destroy()

        return res.redirect('/')
    },
}

module.exports = mainController