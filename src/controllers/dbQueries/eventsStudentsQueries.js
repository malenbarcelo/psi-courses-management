const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Courses_events_students

const eventsStudentsQueries = {
    eventCompanyAssignedStudents: async(companyId,eventId) => {        
        const assignedStudents = await model.findAll({
            where:{
                id_companies:companyId,
                id_events:eventId
            },
            raw:true

        })
        return assignedStudents
    },
    companyAssignedStudents: async(companyId) => {        
        const assignedStudents = await model.findAll({
            where:{
                id_companies:companyId,
            },
            raw:true

        })
        return assignedStudents
    },
    deleteStudents: async(companyId,eventId) => {        
        await model.destroy({
            where:{
                id_companies:companyId,
                id_events:eventId
            }
        })
    },
    assignStudents: async(students) => {
        for (let i = 0; i < students.length; i++) {
            await model.create({
                first_name:students[i].first_name,
                last_name:students[i].last_name,
                email:students[i].email,
                dni:students[i].dni,
                id_events:students[i].id_events,
                id_companies:students[i].id_companies,
                id_courses:students[i].id_courses,
            })
        }        
        
    },
}

module.exports = eventsStudentsQueries