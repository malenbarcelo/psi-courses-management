const db = require('../../../database/models')
const model = db.Quotations

const quotationsQueries = {
    allData: async() => {        
        const allData = await model.findAll({
            where:{
                enabled:1,
            }
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
    saveQuotation: async(data) => {        
        await model.create(data)
    },
}

module.exports = quotationsQueries