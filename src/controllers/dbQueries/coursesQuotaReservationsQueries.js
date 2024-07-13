const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const model = db.Courses_quota_reservations

const coursesQuotaReservationsQueries = {
    reserveQuota: async(data) => {        
        await model.create({
            id_courses:data.id_courses,
            id_events:data.id_events,
            id_companies:data.id_companies,
            reserved_quota:data.reserved_quota,
            id_users:1,
            enabled:1

        })
    },
    cancelReservation: async(data) => {        
        await model.update(
            { enabled: 0, id_users: 2 },
            {
                where: {
                    id_events: data.id_events,
                    id_companies: data.id_companies,
                },
            }
        );
    },
    findCompanyReservations: async(idEvent,idCompany) => {        
        const findCompanyReservations = await Courses_quota_reservations.findAll({
            where:{id_events:idCompany}
        })
        return findCompanyReservations
    },
}

module.exports = coursesQuotaReservationsQueries