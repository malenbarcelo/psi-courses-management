const db = require('../../../database/models')
const model = db.Quotations_status

const quotationsStatusQueries = {
    allData: async() => {        
        const allData = await model.findAll({
            where:{
                enabled:1,
            }
        })
        return allData
    }
}

module.exports = quotationsStatusQueries