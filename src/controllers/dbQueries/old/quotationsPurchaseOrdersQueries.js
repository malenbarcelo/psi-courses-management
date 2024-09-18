const db = require('../../../database/models')
const model = db.Quotations_purchase_orders

const quotationsPurchaseOrders = {
    create: async(data) => {        
        await model.create(data)
    },
    find: async (data) => {        
        const qpo = await model.findOne({
            where: {
                ...data
            }
        })
        return qpo
    },
    update: async(data,id) => {        
        await model.update(data, {
            where: { id: id }
        })
    },
}

module.exports = quotationsPurchaseOrders