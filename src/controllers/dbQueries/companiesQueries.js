const db = require('../../../database/models')
const sequelize = require('sequelize')
const Users_companies = db.Users_companies

const companiesQueries = {
    companies: async() => {        
        const companies = await db.Users_companies.findAll({
            where:{enabled:1},
            order:['company_name'],
            raw:true,
        })
        return companies
    },
    createCompany: async(companyName) => {        
        await db.Users_companies.create({
            company_name: companyName,
            enabled:1
        })
    },
}

module.exports = companiesQueries