const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col, literal } = require('sequelize')
const model = db.Courses_events_students

const eventsStudentsQueries = {
    allData: async() => {        
        const allData = await model.findAll({
            include: [
                {association: 'event_data'},
                {association: 'company_data'},
                {association: 'course_data'}
            ],
            order:[['last_name','ASC']],
            where:{
                enabled:1
            },
            raw:true,
            nest:true

        })
        return allData
    },
    companyData: async(idCompany) => {        
        const allData = await model.findAll({
            include: [
                {association: 'event_data'},
                {association: 'company_data'},
                {association: 'course_data'}
            ],
            where:{
                id_companies:idCompany,
                enabled:1
            },
            order:[['last_name','ASC']],
            raw:true,
            nest:true

        })
        return allData
    },
    cancel: async(data) => {        
        await model.update(
            {
                enabled:0
            },
            {
                where:{
                    id_companies:data.id_companies,
                    id_events:data.id_events
                }
            }            
        )
    },

    filterStudents: async(idCompanies) => {        
        const filterStudents = await model.findAll({
            include: [
                {association: 'event_data'},
                {association: 'company_data'},
                {association: 'course_data'}
            ],
            where:{
                enabled:1,
                id_companies:idCompanies
            },
            raw:true,
            nest:true

        })
        return filterStudents
    },
    eventCompanyAssignedStudents: async(companyId,eventId) => {        
        const assignedStudents = await model.findAll({
            where:{
                id_companies:companyId,
                id_events:eventId,
                enabled:1
            },
            raw:true

        })
        return assignedStudents
    },
    companyAssignedStudents: async(companyId) => {        
        const assignedStudents = await model.findAll({
            where:{
                id_companies:companyId,
                enabled:1
            },
            raw:true

        })
        return assignedStudents
    },
    deleteStudents: async(companyId,eventId,studentFrom) => {
        if (studentFrom == 'customer') {
            await model.destroy(
                {
                    where:{
                        id_companies:companyId,
                        id_events:eventId
                    }
                }
            )
        }else{
            await model.destroy(
                {
                    where:{
                        id_events:eventId
                    }
                }
            )
        }
    },
    assignStudents: async(students) => {
        await model.bulkCreate(students)
    },
    studentsPerCourse: async() => {        
        const studentsPerCourse = await model.findAll({
            attributes: [
                'id_courses',
                [fn('COUNT', fn('DISTINCT', col('dni'))), 'course_students']
              ],
              where: {
                enabled: 1
              },
              group: ['id_courses']
            })

        return studentsPerCourse
    },
    distinctStudents: async() => {
        const distinctStudents = await model.findAll({
            attributes: [
                [sequelize.literal("DISTINCT CONCAT(last_name, ', ', first_name)"), 'student'],
            ],
            order:[['student','ASC']],
            raw:true,
        })
        return distinctStudents
    },
}

module.exports = eventsStudentsQueries