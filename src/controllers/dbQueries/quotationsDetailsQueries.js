const db = require('../../../database/models')
const model = db.Quotations_details

const quotationsQueries = {
    saveQuotationDetails: async(data) => {        
        await model.bulkCreate(data)
    },
}

module.exports = quotationsQueries