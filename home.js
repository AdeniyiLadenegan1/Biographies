const path = require('path')
const express = require('express') //these are the ways we introduce our dependencies into the project
const mongoose  = require ('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require ('express-handlebars')
const  methodOverride = require ('method-override')
const passport = require('passport')
const session = require ('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db') //connecting with the database file
// const { default: mongoose } = require('mongoose')


//load config
dotenv.config({ path: './config/config.env'})



//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//method override

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))



if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handlebars helpers

  const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')


//handlebars for template engine
app.engine('.hbs', exphbs.engine({ helpers: {formatDate, stripTags, truncate, editIcon, select }, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore ({ mongooseConnection: mongoose.connection})
  
})
    
)
  // mongooseConnection: mongoose.connection
//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global var

app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})



//static folder

app.use(express.static(path.join(__dirname, 'public')))


//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/biographies', require('./routes/biographies'))


//to downgrade mongodb
// npm uninstall connect-mongo
// npm i connect-mongo@3


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))