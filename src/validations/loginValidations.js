const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const db = require('../../database/models');
const path = require('path')
const usersQueries = require('../controllers/dbQueries/usersQueries')

const loginValidations = {
    login: [
        body('email')
            .notEmpty().withMessage('Ingrese un usuario').bail()
            .custom(async(value,{ req }) => {
                const email = req.body.email
                const userToLogin = await usersQueries.findUserByEmail(email)
                if (!userToLogin) {
                throw new Error('Usuario inválido')
                }
                return true
            }).bail(),
        body('password')
            .notEmpty().withMessage('Ingrese una contraseña')
            .custom(async(value,{ req }) => {
                const email = req.body.email
                const userToLogin = await usersQueries.findUserByEmail(email)
                if(userToLogin){
                    if (!bcrypt.compareSync(req.body.password, userToLogin.password)) {
                        throw new Error('Contraseña inválida')
                    }
                }else{
                    throw new Error('Contraseña inválida')
                }
                return true
        })
    ],
   
    
    
}

module.exports = loginValidations