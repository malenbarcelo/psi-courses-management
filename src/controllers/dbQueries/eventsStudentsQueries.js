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
            where:{
                enabled:1
            },
            raw:true,
            nest:true

        })
        return allData
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
        for (let i = 0; i < students.length; i++) {
            await model.create({
                first_name:students[i].first_name,
                last_name:students[i].last_name,
                email:students[i].email,
                dni:students[i].dni,
                id_events:students[i].id_events,
                id_companies:students[i].id_companies,
                id_courses:students[i].id_courses,
                enabled:1
            })
        }
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
                [sequelize.literal("DISTINCT CONCAT(last_name, ', ', first_name)"), 'student']
            ],
            raw:true,
        })
        return distinctStudents
    },
}

module.exports = eventsStudentsQueries