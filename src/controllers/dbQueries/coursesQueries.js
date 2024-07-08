const db = require('../../../database/models')
const sequelize = require('sequelize')
const Courses = db.Courses

const coursesQueries = {
    courses: async() => {        
        const courses = await db.Courses.findAll({
            where:{enabled:1},
            order:['course_name'],
            nest:true,
        })
        return courses
    },
}

module.exports = coursesQueries