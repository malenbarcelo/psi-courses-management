const bottomHeaderMenu = require('../data/bottomHeaderMenu')
const months = require('../data/months')
const coursesQueries = require('./dbQueries/coursesQueries')
const companiesQueries = require('./dbQueries/companiesQueries')

const quotationsController = {
    quotations: async(req,res) => {
        try{
            const idSelectedItem = 3
            const route = 'quotations'
            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()            
            
            return res.render('quotations/quotations',{title:'Cotizaciones',bottomHeaderMenu,idSelectedItem,courses,companies,route})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    quotesHistory: async(req,res) => {
        try{
            const idSelectedItem = 3
            const route = 'quotations-history'
            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()
            
            return res.render('quotesHistory/quotesHistory',{title:'Historial de cotizaciones',bottomHeaderMenu,idSelectedItem,courses,companies,months,route})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = quotationsController