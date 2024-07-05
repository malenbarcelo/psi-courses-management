const db = require('../../../database/models')
const sequelize = require('sequelize')
const Users_companies = db.Users_companies

const companiesQueries = {
    companies: async() => {        
        const companies = await db.Users_companies.findAll({
            order:['company_name'],
            raw:true,
        })
        return companies
    },
}

module.exports = companiesQueries