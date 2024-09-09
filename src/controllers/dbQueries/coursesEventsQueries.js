const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const model = db.Courses_events

const coursesEventsQueries = {
    events: async() => {        
        const events = await model.findAll({
            where:{
                enabled:1,
            },
            include: [
                {association: 'events_courses'},
                {association: 'events_invited_companies'},
                {association: 'events_quota_reservations'},
                { 
                    association: 'events_students',
                    include: [{association: 'company_data'}] 
                }
            ],
            order:['start_date'],
            nest:true,
        })
        return events
    },
    editEvent: async(data) => {        
        await model.update({
            id_courses:data.id_courses,
            start_date:data.start_date,
            end_date:data.end_date,
            start_time:data.start_time,
            end_time:data.end_time,
            event_quota:data.event_quota,
            enabled: 1
        },
        {
            where:{
                id:data.id_events
            }
        })
    },
    deleteEvent: async(idEvent) => {        
        await model.update({
            enabled: 0
        },
        {
            where:{
                id:idEvent
            }
        })
    },
    companyEvents: async (idCompany) => {        
        const companyEvents = await model.findAll({
            where: {
                enabled: 1,
            },
            include: [
                {association: 'events_courses'},
                {
                    association: 'events_invited_companies',
                    where: {
                        id_companies: {
                            [Op.eq]: idCompany
                        }
                    },
                    required: true
                },
                {association: 'events_quota_reservations'},
                {association: 'events_quota_reservations'},
                { 
                    association: 'events_students',
                    include: [{association: 'company_data'}] 
                }
            ],
            order: ['start_date'],
            nest: true,
        });
        return companyEvents;
    },
    courseEvents: async(courseId) => {        
        const courseEvents = await model.findAll({
            where:{
                enabled:1,
                id_courses:courseId
            },
            include: [
                {association: 'courses_events_companies'}
            ],
            order:['start_date'],
            nest:true,
        })
        return courseEvents
    },
    findEvent: async(idEvent) => {        
        const findEvent = await model.findOne({
            where:{id:idEvent},
            raw:true,
        })
        return findEvent
    },
    lastEvent: async() => {        
        const coursesEvents = await model.findAll({
            order:[['id','DESC']],
        })

        const lastEvent = coursesEvents[0]

        return lastEvent
    },
    createEvent: async(data) => {        
        const newEvent = await model.create({
            id_courses:data.id_courses,
            start_date:data.start_date,
            end_date:data.end_date,
            start_time:data.start_time,
            end_time:data.end_time,
            event_quota:data.event_quota,
            enabled: 1
        })
        return newEvent
    },
}

module.exports = coursesEventsQueries