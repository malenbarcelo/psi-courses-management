const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const Courses_events_invited_companies = db.Courses_events_invited_companies
const Courses_quota_reservations = db.Courses_quota_reservations

const coursesEventsInvitedCompaniesQueries = {
    create: async(companies,courseId,eventId) => {
        for (let i = 0; i < companies.length; i++) {
            await Courses_events_invited_companies.create({
                id_events:eventId,
                id_companies:companies[i],
                id_courses:courseId,
            })
        }
    },
    getCompanyNextEvents: async(idCompany,endDate) => {        
        const companyNextEvents = await Courses_events_invited_companies.findAll({
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
            order: [[{ model: Courses_events_invited_companies.associations.events_companies_events }, 'start_date', 'ASC']],
        })
        return companyNextEvents
    },
}

module.exports = coursesEventsInvitedCompaniesQueries