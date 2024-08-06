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
}

module.exports = quotationsQueries