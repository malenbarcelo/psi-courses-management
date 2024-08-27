const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Users_companies

const companiesQueries = {
    companies: async() => {        
        const companies = await model.findAll({
            include: [{association: 'companies_users'}],
            where:{enabled:1},
            order:['company_name'],
            nest:true
        })
        return companies
    },
    findCompany: async(idCompany) => {        
        const findCompany = await model.findOne({
            where:{id:idCompany},
            order:['company_name'],
            raw:true,
        })
        return findCompany
    },
    createCompany: async(companyName) => {        
        await model.create({
            company_name: companyName,
            enabled:1
        })
    },
}

module.exports = companiesQueries