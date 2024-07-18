const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Courses_events_students

const eventsStudentsQueries = {
    assignedStudents: async(companyId,eventId) => {        
        const assignedStudents = await model.findAll({
            where:{
                id_companies:companyId,
                id_events:eventId
            },
            raw:true

        })
        return assignedStudents
    },
}

module.exports = eventsStudentsQueries