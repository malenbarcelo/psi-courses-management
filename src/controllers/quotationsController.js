const bottomHeaderMenu = require('../data/bottomHeaderMenu')
const coursesQueries = require('./dbQueries/coursesQueries')
const companiesQueries = require('./dbQueries/companiesQueries')

const quotationsController = {
    quotations: async(req,res) => {
        try{
            const idSelectedItem = 3
            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()
            
            return res.render('quotations/quotations',{title:'Cotizaciones',bottomHeaderMenu,idSelectedItem,courses,companies})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = quotationsController