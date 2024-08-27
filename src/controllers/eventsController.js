const coursesQueries = require('./dbQueries/coursesQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const bottomHeaderMenu = require('../data/bottomHeaderMenu')
const months = require('../data/months')

const eventsController = {
    events: async(req,res) => {
        try{
            const idSelectedItem = 1

            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()

            return res.render('events/events',{title:'Eventos',bottomHeaderMenu,idSelectedItem,courses,companies})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    eventsHistory: async(req,res) => {
        try{
            const idSelectedItem = 1
            const route = 'events-history'

            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()

            return res.render('eventsHistory/eventsHistory',{title:'Eventos',bottomHeaderMenu,idSelectedItem,courses,companies,months,route})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = eventsController