const db = require('../../../database/models')
const sequelize = require('sequelize')
const Courses_events = db.Courses_events

const coursesEventsQueries = {
    courseEvents: async(courseId) => {        
        const courseEvents = await Courses_events.findAll({
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
    lastEvent: async() => {        
        const coursesEvents = await Courses_events.findAll({
            order:[['id','DESC']],
        })

        const lastEvent = coursesEvents[0]

        return lastEvent
    },
    createEvent: async(data) => {        
        await Courses_events.create({
            id_courses:data.id_courses,
            start_date:data.start_date,
            end_date:data.end_date,
            start_time:data.start_time,
            end_time:data.end_time,
            event_quota:data.event_quota,
            enabled: 1
        })
    },
}

module.exports = coursesEventsQueries