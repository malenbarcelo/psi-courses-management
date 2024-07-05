const bottomHeaderMenu = require('../data/bottomHeaderMenu')

const coursesController = {
    courses: (req,res) => {
        try{

            const idSelectedItem = 1
            return res.render('courses/courses',{title:'Cursos',bottomHeaderMenu,idSelectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = coursesController