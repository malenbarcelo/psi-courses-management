const bottomHeaderMenu = require('../data/bottomHeaderMenu')
const companiesQueries = require('./dbQueries/companiesQueries')
const usersCategoriesQueries = require('./dbQueries/usersCategoriesQueries')

const usersController = {
    users: async(req,res) => {
        try{

            const idSelectedItem = 3
            const companies = await companiesQueries.companies()
            const usersCategories = await usersCategoriesQueries.usersCategories()
            
            return res.render('users/users',{title:'Usuarios',bottomHeaderMenu,idSelectedItem,companies,usersCategories})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = usersController