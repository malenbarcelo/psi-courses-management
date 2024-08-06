const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Courses_quota_reservations

const coursesQuotaReservationsQueries = {
    reserveQuota: async(idCourse,idEvent,idCompany,reservedQuota,idUser) => {        
        await model.create({
            id_courses:idCourse,
            id_events:idEvent,
            id_companies:idCompany,
            reserved_quota:reservedQuota,
            id_users:idUser,
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
    companyReservations: async(idCompany) => {        
        const companyReservations = await model.findAll({
            where:{
                id_companies:idCompany,
                enabled:1
            }
        })
        return companyReservations
    },
    eventReservedQuota: async(idCompany,idEvent) => {        
        const eventReservedQuota = await model.sum('reserved_quota', {
            where: {
                id_companies: idCompany,
                id_events: idEvent,
                enabled: 1
            }
        })
        return eventReservedQuota
    },
    companiesPerCourse: async() => {        
        const companiesPerCourse = await model.findAll({
            attributes: [
                'id_courses',
                [fn('COUNT', fn('DISTINCT', col('id_companies'))), 'course_companies']
              ],
              where: {
                enabled: 1
              },
              group: ['id_courses']
            })

        return companiesPerCourse
    },
    reservationsPerEventCompany: async() => {        
        const reservationsPerEventCompany = await model.findAll({
            attributes: [
                'id_events',
                'id_companies',
                [sequelize.fn('SUM', sequelize.col('reserved_quota')), 'total_quota_reservations']
            ],
            where: {
                enabled: 1
            },
            group: ['id_events', 'id_companies']
        })

        return reservationsPerEventCompany
    },
}

module.exports = coursesQuotaReservationsQueries