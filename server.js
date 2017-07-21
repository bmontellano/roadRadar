const
  express = require('express'),
  dotenv = require('dotenv').load(),
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
  userRoutes = require('./routes/users.js'),
  User = require('./models/User.js')


//environment port
const
  port = process.env.PORT || 3000,
  mongoConnectionString = process.env.MONGODB_URI || 'mongodb://localhost/roadRadar'

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
app.use(express.static('public'))


//ejs configuration
app.set('view engine', 'ejs')
//app.use(ejsLayouts)

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

app.use((req, res, next) => {
  app.locals.currentUser = req.user //current User is avail in ALL views
  app.locals.loggedIn = !!req.user //boolean loggedIn available in ALL views
  next()
})

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated()
  next()
})


//root route
app.get('/', (req,res) => {
  res.render('index')
})

app.use('/', userRoutes)

app.listen(port, (err) => {
  console.log(err || 'Server running on port' + port)
})

//The POST API

//GET ALL USERS
app.get('/users', (req, res) => {
  User.find({}, (err, user) => {
    if (err) return console.log(err)
    res.json(user)
  })
})

//CREATE USER
app.post('/users', (req, res) => {
  User.create(req.body, (err, user) => {
    if (err) return console.log(err)
    res.json(user)
  })
})

//GET ALL POSTS FROM USER
app.get('/users/posts', (req, res) => {
  User.find({}, (err, users) => {
    if (err) return console.log(err)
    var allPosts = []
    users.forEach(function(user){
      user.posts.forEach(function(post){
        allPosts.push({post: post, user: user})
      })
    })
    res.json(allPosts)
    console.log(allPosts)
  })
})

//CREATE A NEW POST FOR SPECIFIC USER
app.post('/users/posts', (req, res) => {
    console.log("the req.user is : " , req.user)
  User.findById(req.user._id, (err,user) => {
    if (err) return console.log(err)
    console.log("the req.body is : " , req.body)
    console.log("our user is : ", user)
    user.posts.push(req.body)
    user.save((err) => {
      res.json(user)
    })
  })
})

//GET A SPECIFIC POST FROM A SPECIFI USER
app.get('/users/:id/posts/:post_id', (req, res) => {
  User.findById(req.params.id, (err,album) =>{
    if (err) return console.log(err)
    var post = album.posts.id(req.params.post_id)
    res.json(post)
  })
})

//REMOVE A USER'S POST FROM DISPLAY
// app.post('/users/remove', (req, res) => {
//   User.findById(req.params.id, (err,user) =>{
//     if (err) return console.log(err)
//     var post = user.posts.id(req.params.post_id)
//     res.json(post)
//   })
// })

app.post('/users/inactive', (req, res) => {

  var user = new User(req.body.myUser);

  console.log("MY BODYY ---------");
  console.log(req.body)
  console.log("------------");
  user.posts.map( (post,i) => {
      if (post._id == req.body.myPost._id) {
        user.posts[i].active = false
      }
  })
  console.log("---------- MY USER POSTS ---------");
  console.log(user.posts);
  console.log("---------- ---------");
  user.update(user._id, {'posts':user.posts}, (err , user) => {
    if(err) return err
    res.redirect('/')
  })
})

  // User.findById(req.body.myUser, (err, user) => {
  //   if (err) return console.log(err)
  //   console.log("MY BODYY ---------");
  //   console.log(req.body)
  //   console.log("------------");
  //   var myPost = req.body.myPost
  //   myPost.active = false
  //   user.posts.push(myPost)
  //   user.save((err) => {
  //     res.redirect('/')
  //     console.log(err)
  //   })
  //   })
  // })


//   app.post('/albums/:id/songs', (req, res) => {
//   Album.findById(req.params.id, (err,album) => {
//     if (err) return console.log(err)
//     album.songs.push(req.body)
//     album.save((err) => {
//       res.json(album)
//     })
//   })
// })
