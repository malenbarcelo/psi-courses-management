const coursesQueries = require('./dbQueries/coursesQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const bottomHeaderMenu = require('../data/bottomHeaderMenu')

const coursesController = {
    courses: async(req,res) => {
        try{
            const idSelectedItem = 1
            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()
            
            return res.render('courses/courses',{title:'Cursos',bottomHeaderMenu,idSelectedItem,courses,companies})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    events: async(req,res) => {
        try{
            const idSelectedItem = 2

            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()

            return res.render('events/events',{title:'Eventos',bottomHeaderMenu,idSelectedItem,courses,companies})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = coursesController