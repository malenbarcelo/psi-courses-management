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
    quotesHistory: async(req,res) => {
        try{
            const idSelectedItem = 3
            const courses = await coursesQueries.courses()
            const companies = await companiesQueries.companies()
            const months = [
                {
                    number:1,
                    text:'Enero'
                },
                {
                    number:2,
                    text:'Febrero'
                },
                {
                    number:3,
                    text:'Marzo'
                },
                {
                    number:4,
                    text:'Abril'
                },
                {
                    number:5,
                    text:'Mayo'
                },
                {
                    number:6,
                    text:'Junio'
                },
                {
                    number:7,
                    text:'Julio'
                },
                {
                    number:8,
                    text:'Agosto'
                },
                {
                    number:9,
                    text:'Septiembre'
                },
                {
                    number:10,
                    text:'Octubre'
                },
                {
                    number:11,
                    text:'Noviembre'
                },
                {
                    number:12,
                    text:'Diciembre'
                },

            ]
            
            return res.render('quotesHistory/quotesHistory',{title:'Historial de cotizaciones',bottomHeaderMenu,idSelectedItem,courses,companies,months})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = quotationsController