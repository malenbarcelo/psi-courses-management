const db = require('../../../database/models')
const model = db.Quotations_details

const quotationsQueries = {
    save: async(data) => {        
        await model.bulkCreate(data)
    },
    delete: async(idQuotation) => {        
        await model.destroy({
            where:{
                id_quotations:idQuotation
            }
        })
    },
    cancel: async(idQuotation) => {        
        await model.update(
            {
                enabled:0,
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
                enabled:0,
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