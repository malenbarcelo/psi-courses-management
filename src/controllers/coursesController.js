const coursesQueries = require('./dbQueries/coursesQueries')
const bottomHeaderMenu = require('../data/bottomHeaderMenu')

const coursesController = {
    courses: async(req,res) => {
        try{
            const idSelectedItem = 1
            const courses = await coursesQueries.courses()
            
            return res.render('courses/courses',{title:'Cursos',bottomHeaderMenu,idSelectedItem,courses})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = coursesController