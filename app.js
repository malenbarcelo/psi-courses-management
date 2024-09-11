const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const bodyParser = require("body-parser")

//Routes
const mainRoutes = require('./src/routes/mainRoutes.js')
const usersRoutes = require('./src/routes/usersRoutes.js')
const coursesRoutes = require('./src/routes/coursesRoutes.js')
const eventsRoutes = require('./src/routes/eventsRoutes.js')
const quotationsRoutes = require('./src/routes/quotationsRoutes.js')
const apisRoutes = require('./src/routes/apisRoutes.js')

const app = express()

//use public as statis
app.use(express.static(publicPath))

//get forms info as objects
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(express.json())

//set views folder in src/views
app.set('views', path.join(__dirname, 'src/views'));

//set templates extension (ejs)
app.set('view engine','ejs')

//configure session
app.use(session({
    //store: new FileStore(),
    secret:'secret',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: false } // Change to true in PRD to use HTTPS
}))

//middlewares
app.use(userLoggedMiddleware)

//Declare and listen port
const APP_PORT = 3006
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',mainRoutes)
app.use('/users',usersRoutes)
app.use('/apis/users',usersRoutes)
app.use('/courses',coursesRoutes)
app.use('/events',eventsRoutes)
app.use('/apis/events',eventsRoutes)
app.use('/quotations',quotationsRoutes)
app.use('/apis/quotations',quotationsRoutes)
app.use('/apis',apisRoutes)



//console.log(bcrypt.hashSync('user1',10))
