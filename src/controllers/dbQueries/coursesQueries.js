const db = require('../../../database/models')
const sequelize = require('sequelize')
const Courses = db.Courses

const coursesQueries = {
    courses: async() => {        
        const courses = await db.Courses.findAll({
            where:{enabled:1},
            order:['course_name'],
            include: [
                {association: 'courses_courses_events'}
            ],
            nest:true,
        })
        return courses
    },
    createCourse: async(data) => {        
        await db.Courses.create({
            course_name: data.course_name,
            course_description: data.course_description == '' ? null : data.course_description,
            course_quota: data.course_quota == '' ? null : data.course_quota,
            enabled: 1
        })
    },
}

module.exports = coursesQueries