const db = require('../../../database/models')
const model = db.Quotations_events_companies

const quotationsEventsCompaniesQueries = {
    create: async(idEvents,idCompanies) => {        
        await model.create({
            id_events:idEvents,
            id_companies:idCompanies,
            requires_quotation:1,
            enabled:1
        })
    },
    update: async(idEvents,idCompanies,idQuotations) => {        
        await model.update({
            id_quotations: idQuotations
        },
        {
            where:{
                id_events:idEvents,
                id_companies:idCompanies,
                enabled:1
            }
        })
    },
    inProgress: async() => {        
        const inProgress = await model.findAll({
            where:{
                enabled:1,
                requires_quotation:1
            },
            include: [
                {
                    association: 'quotation',
                    include: [{association: 'quotations_status'}]                    
                },
                { 
                    association: 'event',
                    include: [{association: 'events_courses'}] 
                },
                {association: 'company'}
            ],
            nest:true,
        })
        return inProgress
    },
    noQuotationRequired: async(id) => {        
        await model.update({
            requires_quotation:0
        },
        {
            where:{
                id:id
            }
        })
    },
}

module.exports = quotationsEventsCompaniesQueries