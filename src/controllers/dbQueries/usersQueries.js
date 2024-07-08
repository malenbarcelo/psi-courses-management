const db = require('../../../database/models')
const sequelize = require('sequelize')
const Users = db.Users

const usersQueries = {
    users: async() => {        
        const users = await db.Users.findAll({
            include: [
                {association: 'users_companies'},
                {association: 'users_categories'}
            ],
            where:{enabled:1},
            order:['last_name'],
            nest:true,
        })
        return users
    },
    findUser: async(idUser) => {        
        const user = await db.Users.findOne({
            include: [
                {association: 'users_companies'},
                {association: 'users_categories'}
            ],
            where:{id:idUser},
            raw:true,
            nest:true,
        })
        return user
    },
    usersLastNames: async() => {        
        const lastNames = await db.Users.findAll({
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.col('last_name')), 'last_name']
            ],
            order:['last_name'],
            nest:true,
        })
        return lastNames
    },
    usersFirstNames: async() => {        
        const firstNames = await db.Users.findAll({
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.col('first_name')), 'first_name']
            ],
            order:['first_name'],
            nest:true,
        })
        return firstNames
    },
    usersEmails: async() => {        
        const emails = await db.Users.findAll({
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.col('email')), 'email']
            ],
            order:['email'],
            nest:true,
        })
        return emails
    },
    editUser: async(data) => {        
        await db.Users.update(
            { 
                last_name:data.last_name,
                first_name:data.first_name,
                id_users_categories:data.id_users_categories
             },
            { where: { id:data.id } }
        )
    },
    blockUser: async(idUser) => {        
        await db.Users.update(
            { enabled:0 },
            { where: { id:idUser } }
        )
    },
    restorePassword: async(idUser,newPassword) => {        
        await db.Users.update(
            { password:newPassword },
            { where: { id:idUser } }
        )
    },
    createUser: async(data,password) => {        
        await db.Users.create(
            {
                first_name: data.cuppFirstName,
                last_name: data.cuppLastName,
                email: data.cuppEmail,
                id_users_categories: data.cuppCategory,
                id_companies: data.cuppCompany,
                password:password,
                enabled:1
            },
        )
    },
}

module.exports = usersQueries