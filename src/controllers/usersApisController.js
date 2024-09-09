const usersQueries = require('./dbQueries/usersQueries')
const usersCategoriesQueries = require('./dbQueries/usersCategoriesQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const bcrypt = require('bcryptjs')

const usersApisController = {
  users: async(req,res) =>{
    try{

      const users = await usersQueries.users()

      res.status(200).json(users)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  companies: async(req,res) =>{
    try{

      const companies = await companiesQueries.companies()

      res.status(200).json(companies)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createCompany: async(req,res) =>{
    try{

      const companyName = req.body.company_name

      await companiesQueries.createCompany(companyName)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editCompany: async(req,res) =>{
    try{

      const companyName = req.body.companyName
      const idCompany = req.body.idCompany      

      await companiesQueries.editCompany(idCompany,companyName)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  usersCategories: async(req,res) =>{
    try{

      const usersCategories = await usersCategoriesQueries.usersCategories()

      res.status(200).json(usersCategories)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  predictLastNames: async(req,res) =>{
    try{

      const string = req.params.string.toLowerCase()
      const list = await usersQueries.usersLastNames()
      const predictedList = list.filter(l => l.last_name.toLowerCase().includes(string))
      const uniqueList = [...new Set(predictedList)]
      res.status(200).json(uniqueList)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  predictFirstNames: async(req,res) =>{
    try{

      const string = req.params.string.toLowerCase()
      const list = await usersQueries.usersFirstNames()
      const predictedList = list.filter(l => l.first_name.toLowerCase().includes(string))
      const uniqueList = [...new Set(predictedList)]
      res.status(200).json(uniqueList)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  predictEmails: async(req,res) =>{
    try{

      const string = req.params.string.toLowerCase()
      const list = await usersQueries.usersEmails()
      const predictedList = list.filter(l => l.email.toLowerCase().includes(string))
      const uniqueList = [...new Set(predictedList)]
      res.status(200).json(uniqueList)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editUser: async(req,res) =>{
    try{

      const data = req.body

      await usersQueries.editUser(data)
      
      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  blockUser: async(req,res) =>{
    try{

      const idUser = req.body.idUserToBlock

      await usersQueries.blockUser(idUser)
      
      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  blockCompany: async(req,res) =>{
    try{

      const idCompany = req.body.idCompany
      
      //block company
      await companiesQueries.blockCompany(idCompany)

      //block users
      await usersQueries.blockUsers(idCompany)
      
      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  restorePassword: async(req,res) =>{
    try{

      const idUser = req.body.idUserToRestore
      const user = await usersQueries.findUser(idUser)
      const newPassword = bcrypt.hashSync(user.email,10)

      await usersQueries.restorePassword(idUser,newPassword)
      
      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },


}
module.exports = usersApisController

