const usersQueries = require('./dbQueries/usersQueries')
const usersCategoriesQueries = require('./dbQueries/usersCategoriesQueries')
const companiesQueries = require('./dbQueries/companiesQueries')
const {createPassword,transporterData} = require('./functions/generalFunctions')
const bcrypt = require('bcryptjs')

const usersApisController = {
  users: async(req,res) =>{
    try{

      const password = "l)Zmi#S$FEB4"
      const authHeader = req.headers.authorization

      if (!authHeader || authHeader !== `Bearer ${password}`) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const users = await usersQueries.users()

      res.status(200).json(users)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  allUsers: async(req,res) =>{
    try{

      const users = await usersQueries.users()

      res.status(200).json(users)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  usersToShare: async(req,res) =>{
    try{

      const password = "l)Zmi#S$FEB4"
      const authHeader = req.headers.authorization

      if (!authHeader || authHeader !== `Bearer ${password}`) {
        return res.status(401).json({ message: "No autorizado" });
      }

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
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editUser: async(req,res) =>{
    try{

      const data = req.body

      await usersQueries.editUser(data)
      
      res.status(200).json()

    }catch(error){
      console.log(error)
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

        const data = req.body
        const user = await usersQueries.findUserByEmail(data.email)

        if (user != null) {
          const password = createPassword()

          //restore password
          await usersQueries.restorePassword(user.id,password.password)

          //send email
          const transporter = transporterData()

          const mailOptions = {
            from: 'administracion@psi-courses-management.wnpower.host',
            to: user.email,
            subject: 'PSI Smart Services - Recuperación de contraseña',
            html: `
            <p style="color:black;">PSI Smart Services le informa que ha restablecido su contraseña: </p>
            <p style="color:black;"><strong>Usuario:</strong> ${user.email}</p>
            <p style="color:black;"><strong>Contraseña:</strong> ${password.randomPassword}</p>
            <p>Puede ingresar a https://psi-courses-management.wnpower.host con sus datos para administrar cursos </p>                
            `
          }

          await transporter.sendMail(mailOptions)
        }

        res.status(200).json()


      }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
      }
      
  },
  pswValidation: async(req,res) =>{
    try{

      const data = req.body
      const user = await usersQueries.findUserByEmail(data.email)
      
      let validation = user ? (bcrypt.compareSync(data.password, user.password) ? true : false) : false

      res.status(200).json(validation)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  changePassword: async(req,res) =>{
    try{

        const email = req.body.email      
        const password = req.body.password
        const user = await usersQueries.findUserByEmail(email)

        //change password
        const newPassword = bcrypt.hashSync(password,10)
        await usersQueries.restorePassword(user.id,newPassword)

        //send email
        const transporter = transporterData()

        const mailOptions = {
          from: 'administracion@psi-courses-management.wnpower.host',
          to: user.email,
          subject: 'PSI Smart Services - Cambio de contraseña',
          html: `
          <p style="color:black;">PSI Smart Services le informa que ha cambiado su contraseña: </p>
          <p style="color:black;"><strong>Usuario:</strong> ${user.email}</p>
          <p style="color:black;"><strong>Contraseña:</strong> ${password}</p>
          <p>Puede ingresar a https://psi-courses-management.wnpower.host con sus datos para administrar cursos </p>                
          `
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return res.status(500).send(error.toString())
          }
        
        })

        res.status(200).json()


      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
      
  },


}
module.exports = usersApisController

