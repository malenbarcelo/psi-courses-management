const db = require('../../../database/models')
const { Op } = require('sequelize')
const model = db.Quotations

const quotationsQueries = {
    quotations: async() => {
        const allData = await model.findAll({
            include: [
                {association: 'quotations_companies'},
                {association: 'quotations_status'},
                {association: 'quotations_details'},
                {association: 'quotations_purchase_orders'}
            ],
            order:[['quotation_number','DESC']]
        })
        return allData
    },
    companyQuotations: async(idCompany) => {
        const allData = await model.findAll({
            where:{
                enabled:1,
                id_companies:idCompany,
                id_status: {
                    [Op.notIn]: [3]
                }
            },
            include: [
                {association: 'quotations_companies'},
                {association: 'quotations_status'},
                {association: 'quotations_details'},
                {association: 'quotations_purchase_orders'}
            ],
            order:[['quotation_number','DESC']]
        })
        return allData
    },
    findQuotation: async (data) => {        
        const findQuotation = await model.findAll({
            where: {
                ...data
            }
        })
        return findQuotation
    },
    save: async(data) => {        
        const newQuotation = await model.create(data)
        return newQuotation
    },
    update: async(data,idQuotation) => {
        await model.update(data, {
            where: {
                id: idQuotation
            }
        })
    },
    cancel: async(idQuotation) => {        
        await model.update(
            {
                id_status:7
            },
            {
                where:{
                    id:idQuotation
                }
            }
        )
    },
    refuse: async(idQuotation) => {        
        await model.update(
            {
                id_status:6
            },
            {
                where:{
                    id:idQuotation
                }
            }
        )
    },
}

module.exports = quotationsQueries