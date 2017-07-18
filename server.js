const
  express = require('express'),
  app = express(),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session),
  passport = require('passport'),

  passportConfig = require('./config/passport.js'),
  userRoutes = require('./routes/users.js')


//environment port
const
  port = process.env.PORT || 3000,
  mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/roadRadar'

//mongoose connection
mongoose.connect(mongoConnectionString, (err) => {
  console.log(err || 'Connected to MongoDB (roadRadar)')
})

//will store session information as a 'sessions' collection in Mongo
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
})

//middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(flash())

//ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//session + pasport
app.use(session({
  secret: 'boomchakalaka',
  cookie: {maxAge: 60000000},
  resave: true,
  saveUninitialized: false,
  store: store
}))

app.use(passport.initialize())
app.use(passport.session())
// 
// app.use('/', userRoutes)
// app.listen(port, (err) => {
//   console.log(err || 'Server running on port' + port)
// })

//root route
app.get('/', (req,res) => {
  res.render('index')
})
app.listen(port, (err) => {
  console.log(err || 'Server running on port' + port)
})
