const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const model = db.Courses_events_invited_companies
const Courses_quota_reservations = db.Courses_quota_reservations

const coursesEventsInvitedCompaniesQueries = {
    create: async(companies,courseId,eventId) => {
        for (let i = 0; i < companies.length; i++) {
            await model.create({
                id_events:eventId,
                id_companies:companies[i],
                id_courses:courseId,
            })
        }
    },
    delete: async(idEvents) => {        
        await model.destroy(
            {
                where:{
                    id_events:idEvents
                }
            }
        )
    },
    getCompanyNextEvents: async(idCompany,endDate) => {        
        const companyNextEvents = await model.findAll({
            where:{id_companies:idCompany},
            include: [
                {
                    association: 'events_companies_events',
                    where: {
                        end_date: {[Op.gte]: new Date(endDate)}
                    },
                    include: [
                        { model: Courses_quota_reservations, as: 'events_quota_reservations' }
                    ]
                },
                {association: 'events_companies_courses'},
                {association: 'events_companies_companies'}
            ],
            order: [[{ model: model.associations.events_companies_events }, 'start_date', 'ASC']],
        })
        return companyNextEvents
    },
}

module.exports = coursesEventsInvitedCompaniesQueries