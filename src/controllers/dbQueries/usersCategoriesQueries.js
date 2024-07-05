const db = require('../../../database/models')
const sequelize = require('sequelize')
const Users_categories = db.Users_categories

const usersCategoriesQueries = {
    usersCategories: async() => {        
        const usersCategories = await db.Users_categories.findAll({
            order:['user_category'],
            nest:true,
        })
        return usersCategories
    },
}

module.exports = usersCategoriesQueries