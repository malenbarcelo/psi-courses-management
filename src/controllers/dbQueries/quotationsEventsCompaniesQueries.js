const db = require('../../../database/models')
const model = db.Quotations_events_companies
const { Op } = require('sequelize')
const { allData } = require('./eventsStudentsQueries')

const quotationsEventsCompaniesQueries = {
    allData: async() => {        
        const allData = await model.findAll({
            where:{
                enabled:1,
            },
            include: [
                {
                    association: 'quotation',
                    include: [
                        {association: 'quotations_status'},
                        {association: 'quotations_details'},
                        {association: 'quotations_purchase_orders'}
                    ]                    
                },
            ],
            nest:true,
        })
        return allData
    },
    create: async(idEvents,idCompanies) => {        
        await model.create({
            id_events:idEvents,
            id_companies:idCompanies,
            id_quotations:null,
            id_quotations_status:4,
            requires_quotation:1,
            enabled:1
        })
    },
    update: async(idEvents,idCompanies,idStatus,idQuotations) => {        
        await model.update({
            id_quotations: idQuotations,
            id_quotations_status:idStatus
        },
        {
            where:{
                id_events:idEvents,
                id_companies:idCompanies,
                enabled:1
            }
        })
    },
    updateStatus: async(idQuotation,idStatus) => {        
        await model.update({
            id_quotations_status:idStatus
        },
        {
            where:{
                id_quotations:idQuotation,
                enabled:1
            }
        })
    },
    updateToNull: async(idQuotations) => {        
        await model.update({
            id_quotations: null,
            id_quotations_status: 4

        },
        {
            where:{
                id_quotations:idQuotations,
            }
        })
    },
    inProgress: async() => {        
        const inProgress = await model.findAll({
            where:{
                enabled:1,
                requires_quotation:1,
                id_quotations_status: {
                    [Op.in]: [2, 3, 4]
                }
            },
            include: [
                {
                    association: 'quotation',
                    include: [
                        {association: 'quotations_status'},
                        {association: 'quotations_details'}
                    ]                    
                },
                { 
                    association: 'event',
                    include: [{association: 'events_courses'}] 
                },
                {association: 'company'},
                {association: 'quotation_status'}
            ],
            order:[['id_events','ASC']],
            nest:true,
        })
        return inProgress
    },
    companyInProgress: async(idCompany) => {        
        const inProgress = await model.findAll({
            where:{
                enabled:1,
                requires_quotation:1,
                id_companies:idCompany,
                id_quotations_status: {
                    [Op.in]: [2, 3, 4]
                }
            },
            include: [
                {
                    association: 'quotation',
                    include: [
                        {association: 'quotations_status'},
                        {association: 'quotations_details'}
                    ]                    
                },
                { 
                    association: 'event',
                    include: [{association: 'events_courses'}] 
                },
                {association: 'company'},
                {association: 'quotation_status'}
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